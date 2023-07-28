import mongoose from "mongoose";

const activityInfo = {
    count: { // จำนวนกิจกรรม
        type: Number,
        default: 0
    },
    hour: { // จำนวนชั่วโมง
        type: Number,
        default: 0
    }
}

const achievement = {
    hr1: {
        type: Number,
        Max: 1
    },
    hr10: {
        type: Number,
        Max: 10
    },
    hr100: {
        type: Number,
        Max: 100
    },
    allLocation: {
        // idk how many location pins are there
        type: Number,
        Max: 50
    }
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    nisitId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    accountId: {
        type: mongoose.Types.ObjectId,
        ref: "Account"
    },
    exp: {
        type: Number,
        default: 0
    },
    level: {
        // baseXp = 856
        // lets say xpNeededforNextLevel = floor(baseXp * (level ^ 1.45))
        // actualQuestTime = (questEndTime - startTime) / (1000 * 60 * 60) <- ms to hr
        // xpGiven = floor(actualQuestTime * 1237.6) <- doesn't need creator's input anymnore
        // lv1 - lv10 need 79 hrs
        type: Number,
        default: 1
    },
    joinedQuest: [{
        type: mongoose.Types.ObjectId,
        ref: "Quest"
    }],
    activityTranscipt: {
        name: {
            type: String,
            default: "กิจกรรม"
        },
        ...activityInfo,
        category: {
            university: {
                name: {
                    type: String,
                    default: "กิจกรรมมหาวิทยาลัย"
                },
                ...activityInfo
            },
            empowerment: {
                name: {
                    type: String,
                    default: "กิจกรรมเพื่อเสริมสร้างสมรรถนะ"
                },
                ...activityInfo,
                category: {
                    morality: {
                        name: {
                            type: String,
                            default: "ด้านพัฒนาคุณธรรม จริยธรรม"
                        },
                        ...activityInfo
                    },
                    thingking: {
                        name: {
                            type: String,
                            default: "ด้านการคิดและการเรียนรู้"
                        },
                        ...activityInfo
                    },
                    relation: {
                        name: {
                            type: String,
                            default: "ด้านพัฒนาทักษะเสริมสร้างความสัมพันธ์ระหว่างบุคคล"
                        },
                        ...activityInfo

                    },
                    health: {
                        name: {
                            type: String,
                            default: "ด้านพัฒนาสุขภาพ"
                        },
                        ...activityInfo
                    }
                }
            },
            society: {
                name: {
                    type: String,
                    default: "กิจกรรมเพื่อสังคม"
                },
                ...activityInfo
            },
        }
    }
}, {
    timestamps: true
})

// อัพเดท จำนวนกิจกรรมรวม, ชั่วโมงกิจกรรมรวม 
userSchema.pre("save", function (next) {
    try {
        if (this.isModified('exp')) {
            this.level = Math.floor(Math.pow(1237.6/856*this.exp, 1/1.45));
        }

        const activityTranscipt = this.activityTranscipt
        const { university, society, empowerment } = activityTranscipt.category

        // มีการเพิ่มลด จำนวนกิจกรรม และ ชั่วโมงกิจกรรม ในด้านต่างๆของ กิจกรรมเพื่อเสริมสร้างสมรรถนะ
        if (this.isModified('activityTranscipt.category.empowerment.category')) {
            const { morality, thingking, relation, health } = empowerment.category
            empowerment.count = morality.count + thingking.count + relation.count + health.count
            empowerment.hour = morality.hour + thingking.hour + relation.hour + health.hour
        }

        // มีการเพิ่มลด จำนวนกิจกรรม และ ชั่วโมงกิจกรรม ในประเภทต่างๆของกิจกรรม
        if (this.isModified('activityTranscipt.category')) {
            activityTranscipt.count = university.count + empowerment.count + society.count
            activityTranscipt.hour = university.hour + empowerment.hour + society.hour
        }

        next()
    } catch (error) {
        console.log(error)
    }
})

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User