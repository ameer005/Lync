import otpGenerator from "otp-generator";

function generateOTP(length: number) {
  const OTP = otpGenerator.generate(length, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return OTP;
}

export default generateOTP;
