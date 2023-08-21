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
        progress: {
            type: Number,
            Max: 1,
            default: 0
        },
        isAchieved: {
            type: Boolean,
            default: false
        }
    },
    hr10: {
        progress: {
            type: Number,
            Max: 10,
            default: 0
        },
        isAchieved: {
            type: Boolean,
            default: false
        }
    },
    hr100: {
        progress: {
            type: Number,
            Max: 100,
            default: 0
        },
        isAchieved: {
            type: Boolean,
            default: false
        }
    },
    allLocation: {
        // idk how many location pins are there
        progress: {
            type: Number,
            Max: 50,
            default: 0
        },
        isAchieved: {
            type: Boolean,
            default: false
        }
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
    picturePath: {
        type: String,
    },
    exp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    joinedQuest: [{
        type: mongoose.Types.ObjectId,
        ref: "Quest"
    }],
    activityTranscript: {
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
            this.level = Math.floor(Math.pow(this.exp / 856, 1 / 1.45));
        }

        const activityTranscript = this.activityTranscript
        const { university, society, empowerment } = activityTranscript.category

        // มีการเพิ่มลด จำนวนกิจกรรม และ ชั่วโมงกิจกรรม ในด้านต่างๆของ กิจกรรมเพื่อเสริมสร้างสมรรถนะ
        if (this.isModified('activityTranscript.category.empowerment.category')) {
            const { morality, thingking, relation, health } = empowerment.category
            empowerment.count = morality.count + thingking.count + relation.count + health.count
            empowerment.hour = morality.hour + thingking.hour + relation.hour + health.hour
        }

        // มีการเพิ่มลด จำนวนกิจกรรม และ ชั่วโมงกิจกรรม ในประเภทต่างๆของกิจกรรม
        if (this.isModified('activityTranscript.category')) {
            activityTranscript.count = university.count + empowerment.count + society.count
            activityTranscript.hour = university.hour + empowerment.hour + society.hour
        }

        next()
    } catch (error) {
        console.log(error)
    }
})

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User