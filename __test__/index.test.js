import createApp from "../app"
import * as pactum from 'pactum'
import { connectDb } from "../util/connectDb"
import dotenv from 'dotenv'
import { logger } from "../util/logger"
import { adminInfo, locationInfo, questInfo, userInfo } from "./data"


describe('Test', () => {
    let server;
    beforeAll(async () => {
        dotenv.config();
        const app = createApp()

        // define port and start server
        const PORT = process.env.PORT || 3000;
        server = app.listen(PORT, async () => {
            logger.info(`server start at http://localhost:${PORT}`)
            await connectDb()
        });
        pactum.request.setBaseUrl(`http://localhost:${PORT}/api/v1`);
    })

    afterAll(async () => {
        await server.close()
    })


    describe("User", () => {
        it('should get zero user', async () => {
            return await pactum
                .spec()
                .get('/users')
                .expectStatus(200)
                .expectBody([])
        })
        it('should create a User ', async () => {
            await pactum
                .spec()
                .post('/users')
                .withBody(userInfo)
                .expectStatus(200)
                .expectJsonMatch('firstName', userInfo.firstName)
        })
        it('should get single user', async () => {
            await pactum
                .spec()
                .get('/users')
                .expectStatus(200)
                .expectBodyContains(userInfo.firstName)
        })

    })

    describe("Admin", () => {
        it('should create a Admin ', async () => {
            await pactum
                .spec()
                .post('/admins')
                .withBody(adminInfo)
                .expectStatus(200)
        })
    })


    describe('Auth', () => {
        it('should throw if username not found', async () => {
            return await pactum
                .spec()
                .post('/auth/login')
                .withBody({
                    username: "kit",
                    password: "123",
                })
                .expectStatus(404);
        });
        it('should login (admin)', async () => {
            return await pactum
                .spec()
                .post('/auth/login')
                .withBody({
                    username: "zidequest",
                    password: "123",
                })
                .expectStatus(200)
                .stores('adminAt', 'token')
        });
        it('should login (user)', async () => {
            return await pactum
                .spec()
                .post('/auth/login')
                .withBody({
                    username: "jittat",
                    password: "123123",
                })
                .expectStatus(200)
                .stores('userAt', 'token')
                .stores('userId', 'user._id')
        });
    })

    describe('Location', () => {
        it('should get zero location', async () => {
            return await pactum
                .spec()
                .get('/locations')
                .expectStatus(200)
                .expectBody([])
        })
        it('create location without authorize', async () => {
            await pactum
                .spec()
                .post('/locations')
                .withBody(locationInfo)
                .expectStatus(401)
        })
        it('create location', async () => {
            await pactum
                .spec()
                .post('/locations')
                .withHeaders({
                    Authorization: 'Bearer $S{adminAt}',
                })
                .withBody(locationInfo)
                .stores('locationId', '_id')
                .expectJsonMatch('locationName', locationInfo.locationName)
                .expectStatus(200)
        })
        it('shoud get 1 location', async () => {
            await pactum
                .spec()
                .get('/locations')
                .expectStatus(200)
                .expectBodyContains('$S{locationId}')
        })
    })

    describe('Quest', () => {
        it('should get zero quest', async () => {
            await pactum
                .spec()
                .get('/quests')
                .expectStatus(200)
                .expectBody([])
        })
        it('create quest without authorize', async () => {
            await pactum
                .spec()
                .post('/quests/locations/$S{locationId}')
                .withBody(questInfo)
                .expectStatus(401)
        })
        it('create quest', async () => {
            await pactum
                .spec()
                .post('/quests/locations/$S{locationId}')
                .withHeaders({ Authorization: 'Bearer $S{adminAt}' })
                .withBody(questInfo)
                .stores('questId', '_id')
                .expectJsonMatch('questName', questInfo.questName)
                .expectStatus(200)
        })
        it('should get single quest', async () => {
            await pactum
                .spec()
                .get('/quests')
                .expectStatus(200)
                .expectBodyContains('$S{questId}')
        })

        it('should ', async () => {
            return await pactum
                .spec()
                .get('/quests')
                .expectStatus(200)
                .expectBodyContains('$S{questId}')
        })
        describe('Join Quest', () => {
            it('user join quest', async () => {
                await pactum
                    .spec()
                    .patch('/quests/$S{questId}/join-leave')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
            })
            it('quest should has user ', async () => {
                await pactum
                    .spec()
                    .get('/quests/$S{questId}/participants')
                    .expectStatus(200)
                    .expectBodyContains('$S{questId}')
            })
        })

    })
})

