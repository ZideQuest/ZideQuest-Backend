# API document

## Location

---

-   `POST` Create Location (creator or higher)
    -   path ⇒ /api/location
    -   body (ให้ส่งเป็น formData !!! )
    ```json
    {
        "locationName": "home",
        "latitude": 201024.24124,
        "longitude": 241.124124,
        "img": `picture`
    }
    ```
-   `GET` Get all location (all)
    -   path ⇒ /api/location
-   `GET` Get Location By ID (all) [the location description and all of quest with this location]
    -   path ⇒ /api/location/:id
-   `PUT` Update location By ID (creator or higher)
    -   path ⇒ /api/location/:id
-   `DELETE` Delete location By ID (creator or higher)
    -   path ⇒ /api/location/:id

## Tag

---

-   `POST` Create Tag (admin)
-   `GET` Get Tag (user)
-   `GET`Get Tag By ID (user)
-   `PUT` Update Tag By ID (admin)
-   `DELETE` Delete Tag By ID (admin)

## Quest

---

-   `POST` Create Quest (admin) [handle image]
-   `GET`Get all Quests (all)
-   `GET`Get Quest by Id (all)
-   `PUT` Update Quest by Id (all)
-   `DELETE` Delete Quest By ID (admin)
-
-   `PUT` user join quest (user)
-   `PUT` user leave quest (user)
-
-   `POST` quest complete (creator)
-

ยังไม่ได้ทำ

-   `POST` generate QRcode (creator)
-   `POST` scan QRcode (user)
-
-   `GET` search by questName (all)
-   `GET` filter by tag (all)
-   `GET` filter by time (all)
-
-   `PUT` admin delete user from quest(user)

## Auth

---

-   [x] `POST` Login (all)
-   [ ] `GET` Logout (user)

## User

---

-   [x] `POST` create user (admin)
-   [x] `GET` get user (admin)
-   [x] `GET` get user by id (admin)
-   [x] `PUT` update user by id (admin)

## Admin

---

-   [x] `POST` create admin (admin)
-   [x] `GET` get all admin (admin)
-   [x] `GET` get admin by id (admin)
-   [x] `DELETE` remove admin by id (admin)
-   [x] `PUT` update admin by id (admin)

## Creator

---

-   [x] `POST` create creator (admin)
-   [x] `GET` get all creator (admin)
-   [x] `GET` get creator by id (admin)
-   [x] `DELETE` remove creator by id (admin)
-   [x] `PUT` update creator by id (admin)

## Account `whoever`

---

-   [ ] `GET` get all account by id(admin)
-   [ ] `GET` get account by id (admin)
-   [ ] `DELETE` remove account by id(admin)
-   [ ] `PUT` update account by id (admin)
