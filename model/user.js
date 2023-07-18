import mongoose from "mongoose";

const activityBox = {
    count: {
        type: Number,
        default: 0
    },
    hour: {
        type: Number,
        default: 0
    },
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    nisitId: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    faculty: {
        type: String,
        require: true
    },
    accountId: {
        type: mongoose.Types.ObjectId,
        ref: "Account"
    },
    activityTranscipt: {
        university: {
            name: {
                type: String,
                default: "กิจกรรมมหาวิทยาลัย"
            },
            ...activityBox
        },
        empowerment: {
            name: {
                type: String,
                default: "กิจกรรมเพื่อเสริมสร้างสมรรถนะ"
            },
            ...activityBox,
            category: {
                morality: {
                    name: {
                        type: String,
                        default: "ด้านพัฒนาคุณธรรม จริยธรรม"
                    },
                    ...activityBox
                },
                thingking: {
                    name: {
                        type: String,
                        default: "ด้านการคิดและการเรียนรู้"
                    },
                    ...activityBox
                },
                relation: {
                    name: {
                        type: String,
                        default: "ด้านพัฒนาทักษะเสริมสร้างความสัมพันธ์ระหว่างบุคคล"
                    },
                    ...activityBox

                },
                health: {
                    name: {
                        type: String,
                        default: "ด้านพัฒนาสุขภาพ"
                    },
                    ...activityBox
                }
            }
        },
        society: {
            name: {
                type: String,
                default: "กิจกรรมเพื่อสังคม"
            },
            ...activityBox
        },
    }
}, {
    timestamps: true
})

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User