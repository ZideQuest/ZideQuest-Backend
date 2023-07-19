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