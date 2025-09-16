import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    createdTime: {
        type: Date,
        default: new Date().toLocaleString()
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) 
        return next();

    try {
        //genrating random salts means text and mixing with og password so it can be hashed
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        //saving hashed password in database again
        user.password = hashedPassword;
        next();
    }
    catch (err) {
        console.log(err + "Error in hashing password");
        next();
    }

})

//checking password by compair function
userSchema.methods.comparePassword = async function (cpassword) {
    try {
        const ismatch = await bcrypt.compare(cpassword, this.password);
        return ismatch;
    } catch (err) {
        console.log(err + "Error in comparing password");
        return false;
    }
}
const User = new mongoose.model("User", userSchema);

export default User;