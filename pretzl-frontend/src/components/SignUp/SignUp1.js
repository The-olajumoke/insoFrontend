import React, { useState } from "react";
import * as Yup from "yup";

import { MdClose } from "react-icons/md";
import { FiArrowLeft } from "react-icons/fi";

import SignInCont from "../../components/SignInCont";
import "../../Styling/SignUp.css";
import "../../Styling/Login.css";
import { Form, Formik } from "formik";
import CustomField from "../../components/Form/CustomInput";
import Button from "../../components/SignUp/Button";

import history from "../../utils/history";
import axios from "axios";
import { signUpOne } from "../../redux/User/userSlice";
import { useDispatch } from "react-redux";
import GoogleBtn from "../Form/GoogleBtn";
function SignUp1({ activeModal, setactiveModal }) {
  const dispatch = useDispatch();
  const showResult = () => {
    alert("hello world");
  };
  const handleSubmit = (values, { resetForm }) => {
    // STORE VALUES SOMEWHERE
    const newUser = {
      firstName: values.firstName,
      lastName: values.lastName,
      userName: values.userName,
      phoneNumber: values.phoneNumber,
    };
    // dispatch(signUpOne(newUser, showResult));
    // resetForm();
    // setactiveModal("signUp2");
  };

 

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Required"),
    lastName: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Required"),
    email: Yup.string().email("invalid email address").required("Required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .required("Required"),
  });
  const handleBack = () => {
    history.push("./sign-up");
  };

  return (
    <SignInCont
      title="Sign Up"
      largeText="Say something different."
      extraText="Create an account to gain full access to our features."
      setactiveModal={setactiveModal}
      previousModal="chooseUser"
      backBtnFunction={handleBack}
    >
      <div className="signUp-content">
        <div className="desktopCancel ml-0">
          <div
            onClick={() => {
              history.push("./sign-up");
            }}
            className="backBtn flex items-center"
          >
            <FiArrowLeft className="backIcon cursor-pointer" />
            <h3>Back</h3>
          </div>

          <MdClose
            onClick={() => {
              history.push("./");
            }}
            className=" cursor-pointer h-8 w-8"
          />
        </div>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          isValid={false}
        >
          {({ isSubmitting, isValid, isValidating, dirty }) => (
            <Form className="sign-form ">
              <div className="frame">
                <CustomField
                  name="firstName"
                  type="text "
                  placeholder="First name"
                />
                <CustomField
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                />
                <CustomField
                  name="email"
                  type="email"
                  placeholder="Enter email"
                />
                <CustomField
                  name="password"
                  type="password"
                  placeholder="Enter password"
                />
              </div>

              <div className="btn-holder">
                <GoogleBtn />
                <Button mt="mt-2" disabled={!(isValid && dirty)}>
                  Continue
                </Button>

                <div className=" account-text">
                  <h3 className="">Already have an account?</h3>
                  <button onClick={() => history.push("./log-in")}>
                    Log in
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        {/* button */}
      </div>
    </SignInCont>
  );
}
export default SignUp1;

// const validationSchema = Yup.object().shape({
//   username: Yup.string().test('checkDuplUsername', 'same name exists', function (value) {
//     if (!value) {
//       const isDuplicateExists = await checkDuplicate(value);
//       console.log("isDuplicateExists = ", isDuplicateExists);
//       return !isDuplicateExists;
//     }
//     // WHEN THE VALUE IS EMPTY RETURN `true` by default
//     return true;
//   }),
// });

// function checkDuplicate(valueToCheck) {
//   return new Promise(async (resolve, reject) => {
//     let isDuplicateExists;

//     // EXECUTE THE API CALL TO CHECK FOR DUPLICATE VALUE
//     api.post('url', valueToCheck)
//     .then((valueFromAPIResponse) => {
//       isDuplicateExists = valueFromAPIResponse; // boolean: true or false
//       resolve(isDuplicateExists);
//     })
//     .catch(() => {
//       isDuplicateExists = false;
//       resolve(isDuplicateExists);
//     })
//   });
// }
