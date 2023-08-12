const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto=require("crypto");
require("dotenv")


exports.resetPasswordToken = async (req, res) => {
	const frontendUrl=process.env.REACT_APP_FRONTEND_URL;
	try {
		const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
		const token = crypto.randomBytes(20).toString("hex");

		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);
		// console.log("DETAILS", updatedDetails);

		// const url = `http://localhost:3000/update-password/${token}`;
		const url = `${frontendUrl}/update-password/${token}`;

		await mailSender(
			email,
			"Password Reset Request for Your Account",
			`Dear ${user.firstName},<br>
I hope this email finds you well. We have received a request to reset the password for your account associated with the email address ${email} . If you did not initiate this request, please disregard this email.
<br>If you did request a password reset, please follow the instructions below to reset your password:<br>
<ol>
<li>Click on the following link to navigate to the password reset page: ${url}</li>
<li>On the password reset page, you will be prompted to enter a new password for your account.</li>
<li>Enter your new password and confirm it by typing it again.</li>
<li>Once you have entered and confirmed your new password, click the "Reset Password" button.</li>
</ol>

<p>Please note the following security tips:</p>
<ul>
<li>Choose a strong password that includes a combination of uppercase and lowercase letters, numbers, and symbols.</li>
<li>Do not share your password with anyone.</li>
<li>Regularly update your password for added security.</li>
</ul>
<span>If you encounter any issues during the password reset process or if you did not initiate this request, please contact our support team immediately at [Support Email Address] or [Support Phone Number]. We are here to assist you.</span><br><br><br>
<span>Thank you for using our services. We appreciate your trust in us.</span> <br><br>
<span classname="font-bold">
Best regards, <br>Sameer khan <br>StudyByte
</span>
`
		);

		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};
exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, token } = req.body;

		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
		const userDetails = await User.findOne({ token: token });
		if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.findOneAndUpdate(
			{ token: token },
			{ password: encryptedPassword },
			{ new: true }
		);
		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};