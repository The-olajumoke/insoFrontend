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
    dispatch(signUpOne(newUser, showResult));
    resetForm();
    setactiveModal("signUp2");
  };

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Required"),
    lastName: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Required"),
    userName: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Required"),

    //  .test('Unique Username', 'Username has already been taken',
    //             function (value) {
    //                 return new Promise((resolve, reject) => {
    //                     axios.get(`http://localhost:8003/api/u/user/${value}/available`)
    //                         .then((res) => {
    //                             resolve(true)
    //                         })
    //                         .catch((error) => {
    //                             if (error.response.data.content === "The username has already been taken.") {
    //                                 resolve(false);
    //                             }
    //                         })
    //                 })
    //             }
    //         )
    phoneNumber: Yup.string()
      .required("Required")

      .matches(phoneRegExp, "Invalid phone number"),
  });
  const handleBack = () => {
    history.push("./sign-up");
  };

  return (
    <SignInCont
      title="Sign Up"
      largeText="Say something different."
      extraText=""
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
            userName: "",
            phoneNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          isValid={false}
        >
          {({ isSubmitting, isValid, isValidating, dirty }) => (
            <Form className="sign-form ">
              <div className="frame">
                <CustomField
                  label="First Name"
                  name="firstName"
                  type="text "
                  placeholder="Enter first name"
                />
                <CustomField
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                />
                <CustomField
                  label="Preferred Username"
                  name="userName"
                  type="text"
                  placeholder="Enter username"
                />
                <CustomField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  // req="(optional)"
                />
              </div>

              <div className="btn-holder">
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