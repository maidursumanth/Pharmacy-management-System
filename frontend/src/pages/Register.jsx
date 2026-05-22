import {useState} from "react";
import API from "../services/api";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {FiEye,FiEyeOff,FiCheckCircle} from "react-icons/fi";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";

function Register(){

  const navigate=useNavigate();

  const[form,setForm]=useState({
    name:"",
    email:"",
    password:"",
    employeeId:""
  });

  const[captchaValue,setCaptchaValue]=useState(null);
  const[showPassword,setShowPassword]=useState(false);
  const[loading,setLoading]=useState(false);
  const[otpLoading,setOTPLoading]=useState(false);
  const[resendLoading,setResendLoading]=useState(false);

  const[showOTP,setShowOTP]=useState(false);

  const[otp,setOTP]=useState(
    ["","","","","",""]
  );

  const[emailVerified,setEmailVerified]=useState(false);

  const sendOTP=async()=>{

    if(!form.email){
      toast.error("Enter email first");
      return;
    }

    try{

      setResendLoading(true);

      await API.post(
        "/auth/send-register-otp",
        {
          email:form.email,
          employeeId:form.employeeId
        }
      );

      toast.success("OTP sent to email");

      setShowOTP(true);

    }catch(err){

      toast.error(
        err.response?.data?.message||
        "Failed to send OTP"
      );

    }finally{

      setResendLoading(false);

    }

  };

  const handleOTPChange=(value,index)=>{

    if(!/^\d?$/.test(value))
      return;

    const updatedOTP=[...otp];

    updatedOTP[index]=value;

    setOTP(updatedOTP);

    if(value&&index<5){

      document
        .getElementById(`otp-${index+1}`)
        ?.focus();

    }

    if(!value&&index>0){

      document
        .getElementById(`otp-${index-1}`)
        ?.focus();

    }

  };

  const verifyOTP=async()=>{

    try{

      setOTPLoading(true);

      await API.post(
        "/auth/verify-otp",
        {
          email:form.email,
          otp:otp.join("")
        }
      );

      toast.success("Email verified");

      setEmailVerified(true);

      setShowOTP(false);

    }catch(err){

      toast.error(
        err.response?.data?.message||
        "OTP verification failed"
      );

    }finally{

      setOTPLoading(false);

    }

  };

  const handleSubmit=async(e)=>{

    e.preventDefault();

    if(!captchaValue){
      toast.error("Please complete captcha");
      return;
    }

    if(!emailVerified){
      toast.error("Please verify your email");
      return;
    }

    try{

      setLoading(true);

      await API.post(
        "/auth/register",
        form
      );

      const res=await API.post(
        "/auth/login",
        {
          email:form.email,
          password:form.password
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      toast.success("Account created");

      navigate("/dashboard");

    }catch(err){

      toast.error(
        err.response?.data?.message||
        "Registration failed"
      );

    }finally{

      setLoading(false);

    }

  };

  return(
  <>
  <div className="h-screen flex overflow-hidden bg-gray-100">

    {/* LEFT */}
    <div className="hidden lg:block lg:w-1/2 relative">

      <img
        src="/bg_image.png"
        alt="pharmacy"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50"/>

      <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">

        <div className="mb-8">

          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-5">

            <img
              src="/logo.png"
              alt="logo"
              className="w-7 h-7 object-contain"
            />

          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Pharmacy Inventory
            <br/>
            Management System
          </h1>

          <p className="mt-4 text-gray-200 max-w-md text-sm leading-6">
            Securely manage medicines, staff and inventory operations through one centralized platform.
          </p>

        </div>

      </div>

    </div>

    {/* RIGHT */}
    <div className="flex-1 flex items-center justify-center bg-white px-6 overflow-y-auto py-5">

      <motion.form
        onSubmit={handleSubmit}
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.35}}
        className="w-full max-w-sm"
      >

        {/* TOP */}
        <div className="mb-6">

          <h2 className="text-3xl font-bold text-gray-800">
            Create Account
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            Register to continue
          </p>

        </div>

        {/* NAME */}
        <div className="mb-3">

          <label className="text-sm font-medium text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            name="random_name_field"
            placeholder="Enter your name"
            value={form.name}
            autoComplete="new-password"
            onChange={(e)=>
              setForm({
                ...form,
                name:e.target.value
              })
            }
            className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-sm"
            required
          />

        </div>

        {/* EMAIL */}
        <div className="mb-3">

          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>

          <div className="flex gap-2 mt-2">

            <input
              type="email"
              name="random_email_field"
              placeholder="Enter your email"
              value={form.email}
              autoComplete="new-password"
              onChange={(e)=>
                setForm({
                  ...form,
                  email:e.target.value
                })
              }
              className="flex-1 border border-gray-300 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-sm"
              required
            />

            <button
              type="button"
              onClick={sendOTP}
              disabled={emailVerified||resendLoading}
              className={`px-4 rounded-2xl text-sm font-medium transition ${
                emailVerified
                ?"bg-green-100 text-green-700"
                :"bg-green-600 hover:bg-green-700 text-white"
              }`}
            >

              {emailVerified
                ?<FiCheckCircle size={18}/>
                :resendLoading
                ?"Sending..."
                :"Verify"
              }

            </button>

          </div>

        </div>

        {/* EMPLOYEE ID */}
        <div className="mb-3">

          <label className="text-sm font-medium text-gray-700">
            Employee ID
          </label>

          <input
            type="text"
            name="random_employee_field"
            placeholder="Enter employee ID"
            value={form.employeeId}
            autoComplete="new-password"
            onChange={(e)=>
              setForm({
                ...form,
                employeeId:e.target.value
              })
            }
            className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-sm"
            required
          />

        </div>

        {/* PASSWORD */}
        <div className="mb-4">

          <label className="text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative mt-2">

            <input
      type={
        showPassword
        ?"text"
        :"password"
      }
      name="random_password_field"
      placeholder="Enter password"
      value={form.password}
      autoComplete="new-password"
      onChange={(e)=>
        setForm({
          ...form,
          password:e.target.value
        })
      }
      className="w-full border border-gray-300 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-sm"
      required
    />
                        <button
              type="button"
              onClick={()=>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-3 text-gray-500"
            >

              {showPassword
                ?<FiEyeOff size={18}/>
                :<FiEye size={18}/>
              }

            </button>

          </div>

        </div>

        {/* CAPTCHA */}
        <div className="mb-4 flex justify-center scale-[0.88] origin-center">

          <ReCAPTCHA
            sitekey={
              import.meta.env
              .VITE_RECAPTCHA_SITE_KEY
            }
            onChange={(value)=>
              setCaptchaValue(value)
            }
          />

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-2xl font-semibold text-white transition-all duration-300 text-sm ${
            loading
            ?"bg-green-400 cursor-not-allowed"
            :"bg-green-600 hover:bg-green-700 hover:shadow-lg"
          }`}
        >

          {loading
            ?"Creating account..."
            :"Create Account"
          }

        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-5">

          Already have an account?{" "}

          <button
            type="button"
            onClick={()=>
              navigate("/")
            }
            className="text-green-600 font-semibold hover:underline"
          >
            Sign In
          </button>

        </p>

      </motion.form>

    </div>

  </div>

  {/* OTP MODAL */}
  {showOTP&&(

  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <h2 className="text-xl font-bold text-gray-800">
          Verify Email
        </h2>

        <button
          onClick={()=>{
            setShowOTP(false);
            setOTP(["","","","","",""]);
          }}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-lg"
        >
          ✕
        </button>

      </div>

      <p className="text-sm text-gray-500 mt-2 text-center">
        Enter the 6 digit OTP sent to your email
      </p>

      <p className="text-xs text-orange-500 text-center mt-2">
        Check Spam folder in Gmail if OTP is not visible
      </p>

      {/* OTP BOXES */}
      <div className="flex justify-center gap-2 mt-6">

        {otp.map((digit,index)=>(

        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          autoComplete="off"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e)=>{
            handleOTPChange(
              e.target.value,
              index
            );
          }}
          className="w-11 h-12 border border-gray-300 rounded-xl text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-green-500"
        />

        ))}

      </div>

      {/* VERIFY BUTTON */}
      <button
        onClick={verifyOTP}
        disabled={otpLoading}
        className={`w-full mt-6 py-3 rounded-2xl font-medium transition ${
          otpLoading
          ?"bg-green-400 cursor-not-allowed text-white"
          :"bg-green-600 hover:bg-green-700 text-white"
        }`}
      >

        {otpLoading
          ?"Verifying..."
          :"Verify OTP"
        }

      </button>

      {/* RESEND BUTTON */}
      <button
        onClick={sendOTP}
        disabled={resendLoading}
        className={`w-full mt-3 py-2.5 rounded-2xl font-medium transition text-sm ${
          resendLoading
          ?"bg-gray-100 text-gray-400 cursor-not-allowed"
          :"border border-green-600 text-green-600 hover:bg-green-50"
        }`}
      >

        {resendLoading
          ?"Sending..."
          :"Resend OTP"
        }

      </button>

    </div>

  </div>

  )}

  </>
  );
}

export default Register;