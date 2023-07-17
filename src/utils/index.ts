export const generateOTPCode = () => {
  const characters = '0123456789';
  let generatedCode = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    generatedCode += characters.charAt(randomIndex);
  }
  return generatedCode;
};
