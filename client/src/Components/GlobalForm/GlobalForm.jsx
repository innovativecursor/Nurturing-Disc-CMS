import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import PageWrapper from "../PageContainer/PageWrapper";
import { parseISO } from "date-fns";
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Slider,
  Space,
  Spin,
  Switch,
  TreeSelect,
  Upload,
} from "antd";
import Creatable from "react-select/creatable";
import Select from "react-select";
import {
  deleteAxiosCall,
  getAxiosCall,
  postAxiosCall,
  updateAxiosCall,
} from "../../Axios/UniversalAxiosCalls";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
const { TextArea } = Input;
function GlobalForm(props) {
  const [imageArray, setImageArray] = useState([]);
  const [inputs, setInputs] = useState({});
  const [imageClone, setImageClone] = useState([]);
  const [company_testimonialImage, setCompany_testimonialImage] = useState(
    props?.record?.pictures
  );
  const NavigateTo = useNavigate();

  useEffect(() => {
    if (props?.record) {
      setInputs(props.record);
      setImageClone(props?.record?.pictures);
    }
  }, [props?.record]);
  useEffect(() => {
    if (props?.type == "Gallery") {
      callGallery();
    }
  }, [props?.type]);
  const beforeUpload = (file) => {
    const isValidType = ["image/png", "image/jpeg", "image/webp"].includes(
      file.type
    );

    if (!isValidType) {
      message.error("You can only upload PNG, JPG, JPEG, or WEBP files!");
      return;
    }

    return isValidType; // Return false to prevent the upload if the file type is not valid
  };
  const callGallery = async () => {
    const answer = await getAxiosCall("/fetchGallery");
    setImageClone(answer?.data);
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const convertAllToBase64 = async () => {
    if (props.pageMode === "Add") {
      if (imageArray?.length != 0) {
        let B64Array = [];
        let asd;
        for (let i = 0; i < imageArray?.length; i++) {
          const base64String = await getBase64(imageArray[i]?.originFileObj);
          B64Array.push(base64String);
        }
        let dummyObj = { pictures: [...B64Array] };

        asd = Object.assign(inputs, { pictures: dummyObj?.pictures });
        setInputs({ ...inputs, pictures: asd });
      }
    } else {
      if (imageArray?.length != 0) {
        let B64Array = [];
        let asd;
        for (let i = 0; i < imageArray.length; i++) {
          const base64String = await getBase64(imageArray[i]?.originFileObj);
          B64Array.push(base64String);
        }
        if (props?.type == "Gallery") {
          let dummyObj = { pictures: [...B64Array] };

          asd = Object.assign(inputs, { pictures: dummyObj?.pictures });
          setInputs({ ...inputs, pictures: asd });
        } else {
          let dummyObj = [...(inputs && inputs?.pictures)];

          dummyObj = [...dummyObj, ...B64Array];
          asd = Object.assign(inputs, { pictures: dummyObj });
          setInputs({ ...inputs, pictures: asd });
        }
      }
    }
  };
  // A submit form used for both (i.e.. Products & Awards)
  const submitForm = async () => {
    if (props?.type == "Testimonials") {
      if (!inputs?.reviewer_name || !inputs?.review) {
        Swal.fire({
          title: "error",
          text: "Reviewer's Name & Review are mandatory fields",
          icon: "error",
          confirmButtonText: "Alright!",
          allowOutsideClick: false,
        });
        return;
      }
    }
    try {
      switch (props.pageMode) {
        case "Add":
          if (imageArray.length == 0) {
            Swal.fire({
              title: "error",
              text: "Add at least one Picture to proceed!",
              icon: "error",
              confirmButtonText: "Alright!",
              allowOutsideClick: false,
            });
            return;
          }
          // Converting images to base64
          await convertAllToBase64();

          if (props.type == "Testimonials") {
            let answer;
            answer = await postAxiosCall("/createTestimonial", inputs);
            if (answer) {
              Swal.fire({
                title: "Success",
                text: answer?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload(true);
              });
              setInputs({});
            }
          }

          if (props.type == "Events") {
            let answer;
            answer = await postAxiosCall("/postEvents", inputs);
            if (answer) {
              Swal.fire({
                title: "Success",
                text: answer?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload(true);
              });
              setInputs({});
            }
          }
          if (props.type == "Staff") {
            let answer;
            answer = await postAxiosCall("/createStaff", inputs);
            if (answer) {
              Swal.fire({
                title: "Success",
                text: answer?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload(true);
              });
              setInputs({});
            }
          }
          if (props.type == "Blogs") {
            console.log("inputs", inputs);
            let answer;
            answer = await postAxiosCall("/createBlog", {
              ...inputs,
              date: new Date().toISOString(),
            });
            if (answer) {
              Swal.fire({
                title: "Success",
                text: answer?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload(true);
              });
              setInputs({});
            }
          }
          break;
        case "Update":
          if (imageArray.length == 0 && imageClone.length == 0) {
            Swal.fire({
              title: "error",
              text: "Add at least one Picture to proceed!",
              icon: "error",
              confirmButtonText: "Alright!",
              allowOutsideClick: false,
            });
            return;
          }

          //merging the new images (if uploaded)
          await convertAllToBase64();
          if (props.type == "Gallery") {
            let answer = await postAxiosCall("/updateGallery", inputs);
            if (answer) {
              Swal.fire({
                title: "Success",
                text: answer?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload(true);
              });
              setInputs({});
            }
          }
          if (props.type == "Events") {
            let answer = await updateAxiosCall(
              "/updateEvent",
              props?.record?.event_id,
              inputs
            );
            if (answer) {
              Swal.fire({
                title: "Success",
                text: answer?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload(true);
              });
              setInputs({});
              NavigateTo("/updateEvents");
            }
          }
          if (props.type == "Blogs") {
            let answer = await updateAxiosCall(
              "/updateBlog",
              props?.record?.blog_id,
              inputs
            );
            if (answer) {
              Swal.fire({
                title: "Success",
                text: answer?.message,
                icon: "success",
                confirmButtonText: "Great!",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload(true);
              });
              setInputs({});
              NavigateTo("/updateBlogs");
            }
          }
          break;
        case "Delete":
          Swal.fire({
            title: "info",
            text: "Are You Sure You want to Delete This Product",
            icon: "info",
            confirmButtonText: "Delete",
            showCancelButton: true,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              remove();
            }
          });
          break;
        default:
          break;
      }
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error,
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
    }
  };
  const remove = async () => {
    let answer;
    switch (props.type) {
      case "Testimonials":
        answer = await deleteAxiosCall(
          "/deleteTestimonial",
          props?.record?.testimonial_id
        );
        if (answer) {
          Swal.fire({
            title: "Success",
            text: answer?.message,
            icon: "success",
            confirmButtonText: "Great!",
            allowOutsideClick: false,
          });
          setInputs();

          NavigateTo("/deleteTestimonials");
        }
        break;
      case "Events":
        answer = await deleteAxiosCall(
          "/deleteEvents",
          props?.record?.event_id
        );
        if (answer) {
          Swal.fire({
            title: "Success",
            text: answer?.message,
            icon: "success",
            confirmButtonText: "Great!",
            allowOutsideClick: false,
          });
          setInputs();
          NavigateTo("/deleteEvents");
        }
        break;
      case "Staff":
        answer = await deleteAxiosCall("/deleteStaff", props?.record?.staff_id);
        if (answer) {
          Swal.fire({
            title: "Success",
            text: answer?.message,
            icon: "success",
            confirmButtonText: "Great!",
            allowOutsideClick: false,
          });
          setInputs();
          NavigateTo("/deleteStaff");
        }
        break;
      case "Blogs":
        answer = await deleteAxiosCall("/deleteBlog", props?.record?.blog_id);
        if (answer) {
          Swal.fire({
            title: "Success",
            text: answer?.message,
            icon: "success",
            confirmButtonText: "Great!",
            allowOutsideClick: false,
          });
          setInputs();
          NavigateTo("/deleteBlogs");
        }
        break;
      default:
        break;
    }
  };
  const deleteImage = async (imageIndex) => {
    let answer = await deleteAxiosCall(
      "/gallery",
      imageClone[imageIndex]?.public_id
    );

    if (answer) {
      Swal.fire({
        title: "Success",
        text: answer?.message,
        icon: "success",
        confirmButtonText: "Great!",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload(true);
      });
      setInputs({});
    }
  };
  const deleteFnc = async (imageIndex) => {
    const dupli = inputs?.pictures;
    dupli?.splice(imageIndex, 1);
    setInputs({ ...inputs, pictures: dupli });
  };
  const deleteModal = (index) => {
    Swal.fire({
      title: "info",
      text: "Are You Sure You want to Delete This Picture",
      icon: "info",
      confirmButtonText: "Delete",
      showCancelButton: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        if (props?.type == "Gallery") {
          deleteImage(index);
        } else {
          deleteFnc(index);
        }
      }
    });
  };

  return (
    <>
      {props?.type == "Testimonials" ? (
        <PageWrapper title={`${props?.pageMode} Testimonials`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Reviewer's Name
                  </label>
                  <Input
                    name="reviewer_name"
                    disabled={props?.pageMode === "Delete"}
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    value={inputs?.reviewer_name}
                  />
                </div>
              </div>
              <div className="my-5">
                <label className="block text-sm font-medium text-gray-700">
                  Review
                </label>
                <TextArea
                  disabled={props?.pageMode === "Delete" ? true : false}
                  type="text"
                  id="review"
                  name="review"
                  className="mt-1 p-2 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.review}
                />
              </div>
              {/* Upload Pictures */}
              {props.pageMode === "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Company Profile Picture
                  </label>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    // action="/upload.do"
                    listType="picture-card"
                    multiple={false}
                    name="productImages"
                    fileList={imageArray}
                    maxCount={1}
                    beforeUpload={beforeUpload} // Add the beforeUpload function
                    accept=".png, .jpg, .jpeg, .webp" // Restrict file types for the file dialog
                    onChange={(e) => {
                      setImageArray(e.fileList);
                    }}
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </div>
              ) : (
                ""
              )}
              {/* Pictures */}
              {props?.pageMode !== "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {company_testimonialImage?.map((el, index) => (
                      <div className="card" key={index}>
                        <div className="flex h-60 justify-center">
                          <img
                            src={el?.url}
                            alt="asd4e"
                            className="object-contain"
                          />
                        </div>
                        {props.pageMode !== "View" &&
                        props.pageMode !== "Delete" ? (
                          <div className="flex flex-row justify-center items-end">
                            <button
                              className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                              onClick={() => deleteModal(index)}
                              type="button"
                            >
                              Delete Picture
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="acitonButtons w-full flex justify-center">
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                  type="submit"
                >
                  {props.pageMode} Data
                </button>
              </div>
            </Form>
          </div>
        </PageWrapper>
      ) : props?.type == "Gallery" ? (
        <PageWrapper title={`${props?.pageMode} Pictures`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"></div>
              {/* Upload Pictures */}
              {props.pageMode === "Add" || props.pageMode === "Update" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Pictures
                  </label>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    // action="/upload.do"
                    listType="picture-card"
                    multiple={false}
                    name="productImages"
                    fileList={imageArray}
                    maxCount={4}
                    beforeUpload={beforeUpload} // Add the beforeUpload function
                    accept=".png, .jpg, .jpeg, .webp" // Restrict file types for the file dialog
                    onChange={(e) => {
                      setImageArray(e.fileList);
                    }}
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </div>
              ) : (
                ""
              )}
              {/* Pictures */}
              {props?.pageMode !== "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {imageClone?.map((el, index) => (
                      <div className="card" key={index}>
                        <div className="flex h-60 justify-center">
                          <img
                            src={el?.url}
                            alt="asd4e"
                            className="object-contain"
                          />
                        </div>
                        {props.pageMode !== "View" &&
                        props.pageMode !== "Delete" ? (
                          <div className="flex flex-row justify-center items-end">
                            <button
                              className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                              onClick={() => deleteModal(index)}
                              type="button"
                            >
                              Delete Picture
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
              {props.pageMode === "View" ? (
                ""
              ) : (
                <div className="acitonButtons w-full flex justify-center">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                    type="submit"
                  >
                    {props.pageMode} Data
                  </button>
                </div>
              )}
            </Form>
          </div>
        </PageWrapper>
      ) : props?.type == "Events" ? (
        <PageWrapper title={`${props?.pageMode} Events`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Name of the Event
                  </label>
                  <Input
                    name="event_name"
                    required
                    disabled={props?.pageMode === "Delete"}
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    value={inputs?.event_name}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Event Location
                  </label>
                  <Input
                    name="event_location"
                    required
                    disabled={props?.pageMode === "Delete"}
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    value={inputs?.event_location}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Event Date
                  </label>
                  <Space direction="vertical">
                    <DatePicker
                      size="medium"
                      disabled={props?.pageMode === "Delete"}
                      name="date"
                      value={
                        inputs?.date ? dayjs(inputs.date, "YYYY-MM-DD") : null
                      }
                      onChange={(date, dateString) => {
                        setInputs({
                          ...inputs,
                          date: dateString,
                        });
                      }}
                    />
                  </Space>
                </div>
              </div>
              <div className="my-5">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <TextArea
                  disabled={props?.pageMode === "Delete" ? true : false}
                  type="text"
                  size="large"
                  required
                  id="event_description"
                  name="event_description"
                  className="mt-1 p-2 !h-96 block w-full border rounded-md"
                  onChange={(e) => {
                    setInputs({ ...inputs, [e.target.name]: e.target.value });
                  }}
                  value={inputs?.event_description}
                />
              </div>
              {/* Upload Pictures */}
              {props.pageMode === "Add" || props.pageMode === "Update" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Pictures
                  </label>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    multiple={false}
                    name="productImages"
                    fileList={imageArray}
                    maxCount={4}
                    onChange={(e) => {
                      setImageArray(e.fileList);
                    }}
                    beforeUpload={beforeUpload} // Add the beforeUpload function
                    accept=".png, .jpg, .jpeg, .webp" // Restrict file types for the file dialog
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </div>
              ) : (
                ""
              )}
              {/* Pictures */}
              {props?.pageMode !== "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {imageClone?.map((el, index) => (
                      <div className="card" key={index}>
                        <div className="flex h-60 justify-center">
                          <img
                            src={el?.url}
                            alt="asd4e"
                            className="object-contain"
                          />
                        </div>
                        {props.pageMode !== "View" &&
                        props.pageMode !== "Delete" ? (
                          <div className="flex flex-row justify-center items-end">
                            <button
                              className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                              onClick={() => deleteModal(index)}
                              type="button"
                            >
                              Delete Picture
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
              {props.pageMode === "View" ? (
                ""
              ) : (
                <div className="acitonButtons w-full flex justify-center">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                    type="submit"
                  >
                    {props.pageMode} Data
                  </button>
                </div>
              )}
            </Form>
          </div>
        </PageWrapper>
      ) : props?.type == "Staff" ? (
        <PageWrapper title={`${props?.pageMode} Staff`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Name of the Staff
                  </label>
                  <Input
                    name="staff_name"
                    required
                    disabled={props?.pageMode === "Delete"}
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    value={inputs?.staff_name}
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Staff Designation
                  </label>
                  <Input
                    name="staff_position"
                    required
                    disabled={props?.pageMode === "Delete"}
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    value={inputs?.staff_position}
                  />
                </div>
              </div>
              {/* Upload Pictures */}
              {props.pageMode === "Add" || props.pageMode === "Update" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Pictures
                  </label>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    multiple={false}
                    name="productImages"
                    fileList={imageArray}
                    maxCount={1}
                    onChange={(e) => {
                      setImageArray(e.fileList);
                    }}
                    beforeUpload={beforeUpload} // Add the beforeUpload function
                    accept=".png, .jpg, .jpeg, .webp" // Restrict file types for the file dialog
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </div>
              ) : (
                ""
              )}
              {/* Pictures */}
              {props?.pageMode !== "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {imageClone?.map((el, index) => (
                      <div className="card" key={index}>
                        <div className="flex h-60 justify-center">
                          <img
                            src={el?.url}
                            alt="asd4e"
                            className="object-contain"
                          />
                        </div>
                        {props.pageMode !== "View" &&
                        props.pageMode !== "Delete" ? (
                          <div className="flex flex-row justify-center items-end">
                            <button
                              className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                              onClick={() => deleteModal(index)}
                              type="button"
                            >
                              Delete Picture
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
              {props.pageMode === "View" ? (
                ""
              ) : (
                <div className="acitonButtons w-full flex justify-center">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                    type="submit"
                  >
                    {props.pageMode} Data
                  </button>
                </div>
              )}
            </Form>
          </div>
        </PageWrapper>
      ) : (
        <PageWrapper title={`${props?.pageMode} Blogs`}>
          <div className="container mx-auto p-4 text-xl">
            <Form onFinish={submitForm}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700">
                    Title of the Blog
                  </label>
                  <Input
                    name="blog_title"
                    required
                    disabled={props?.pageMode === "Delete"}
                    onChange={(e) => {
                      setInputs({ ...inputs, [e.target.name]: e.target.value });
                    }}
                    value={inputs?.blog_title}
                  />
                </div>
              </div>
              <div className="flex flex-col my-10">
                <label className="block text-sm font-medium text-gray-700">
                  Writeup of the Blog
                </label>
                <ReactQuill
                  className="h-96 mb-4"
                  theme="snow"
                  readOnly={props.pageMode === "Delete" ? true : false}
                  value={inputs?.blog_content}
                  onChange={(e) => {
                    setInputs({ ...inputs, blog_content: e });
                  }}
                />
              </div>
              {/* Upload Pictures */}
              {props.pageMode === "Add" || props.pageMode === "Update" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Pictures
                  </label>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    multiple={false}
                    name="productImages"
                    fileList={imageArray}
                    maxCount={1}
                    onChange={(e) => {
                      setImageArray(e.fileList);
                    }}
                    beforeUpload={beforeUpload} // Add the beforeUpload function
                    accept=".png, .jpg, .jpeg, .webp" // Restrict file types for the file dialog
                  >
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </div>
              ) : (
                ""
              )}
              {/* Pictures */}
              {props?.pageMode !== "Add" ? (
                <div className="my-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pictures
                  </label>
                  <div className="w-full flex flex-row">
                    {imageClone?.map((el, index) => (
                      <div className="card" key={index}>
                        <div className="flex h-60 justify-center">
                          <img
                            src={el?.url}
                            alt="asd4e"
                            className="object-contain"
                          />
                        </div>
                        {props.pageMode !== "View" &&
                        props.pageMode !== "Delete" ? (
                          <div className="flex flex-row justify-center items-end">
                            <button
                              className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
                              onClick={() => deleteModal(index)}
                              type="button"
                            >
                              Delete Picture
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
              {props.pageMode === "View" ? (
                ""
              ) : (
                <div className="acitonButtons w-full flex justify-center">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
                    type="submit"
                  >
                    {props.pageMode} Data
                  </button>
                </div>
              )}
            </Form>
          </div>
        </PageWrapper>
      )}
    </>
  );
}

export default GlobalForm;
