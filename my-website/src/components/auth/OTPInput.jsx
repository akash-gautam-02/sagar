import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // allow only last char if more than one is typed (e.g. from copy paste or fast typing)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Join and check if complete
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    // Move to next input if current field is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current field is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(data)) return;

    const newOtp = [...otp];
    data.split("").forEach((char, index) => {
      newOtp[index] = char;
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    setOtp(newOtp);
    if (data.length === length) onComplete(data);
  };

  return (
    <div className="flex gap-2 sm:gap-4 justify-center" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          ref={(el) => (inputRefs.current[index] = el)}
          value={data}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-10 h-12 sm:w-12 sm:h-14 border-2 border-gray-100 rounded-xl text-center text-xl font-bold font-syne focus:border-brand-accent focus:bg-white focus:ring-4 focus:ring-brand-accent/10 transition-all outline-none bg-gray-50 text-brand-black"
        />
      ))}
    </div>
  );
};

export default OTPInput;
