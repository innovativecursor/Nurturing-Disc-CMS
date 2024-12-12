import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal } from "antd";
import PageWrapper from "../PageContainer/PageWrapper";
import { getAxiosCall, deleteAxiosCall } from "../../Axios/UniversalAxiosCalls";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ProductTable(props) {
  const [openModal, setopenModal] = useState(false);
  const [inqMessage, setInqMessage] = useState("");
  const [EnrMessage, setEnrMessage] = useState("");

  const inquiry_columns = [
    {
      title: "Inquiry_ID",
      dataIndex: "inquiry_id",
      key: "inquiry_id",
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile_number",
      key: "mobile_number",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <Button
          onClick={() => {
            setopenModal(true), setInqMessage(record?.message);
          }}
        >
          View
        </Button>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <Button onClick={() => deleteInquiry(record.inquiry_id)}>Delete</Button>
      ),
    },
  ];
  const Enrollment_columns = [
    {
      title: "Enrollment ID",
      dataIndex: "enrollment_id",
      key: "enrollment_id",
      fixed: "left",
    },
    {
      title: "Child Name",
      dataIndex: "enrollment_child_name",
      key: "enrollment_child_name",
    },
    {
      title: "Guardian Name",
      dataIndex: "enrollment_guardian_name",
      key: "enrollment_guardian_name",
    },
    {
      title: "Email",
      dataIndex: "enrollment_email_id",
      key: "enrollment_email_id",
    },
    {
      title: "Mobile Number",
      dataIndex: "enrollment_phNumber",
      key: "enrollment_phNumber",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <Button
          onClick={() => {
            setopenModal(true), setEnrMessage(record?.enrollment_message);
          }}
        >
          View
        </Button>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <Button onClick={() => deleteEnrollment(record.enrollment_id)}>
          Delete
        </Button>
      ),
    },
  ];
  const testimonials_col = [
    {
      title: "Testimonial Id",
      dataIndex: "testimonial_id",
      key: "testimonial_id",
      fixed: "left",
    },

    {
      title: "Reviewer Name",
      dataIndex: "reviewer_name",
      key: "reviewer_name",
    },
  ];
  const events_col = [
    {
      title: "Event Name",
      dataIndex: "event_name",
      key: "event_name",
      fixed: "left",
    },

    {
      title: "Event Location",
      dataIndex: "event_location",
      key: "event_location",
    },
    {
      title: "Event Date",
      dataIndex: "date",
      key: "date",
    },
  ];
  const staff_col = [
    {
      title: "Name of the Staff",
      dataIndex: "staff_name",
      key: "staff_name",
      fixed: "left",
    },

    {
      title: "Staff Designation",
      dataIndex: "staff_position",
      key: "staff_position",
    },
  ];
  const blog_col = [
    {
      title: "Blog Title",
      dataIndex: "blog_title",
      key: "blog_title",
      fixed: "left",
    },

    {
      title: "Blog Date",
      dataIndex: "date",
      key: "date",
    },
  ];
  const user_col = [
    {
      title: "User Id",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email Id",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Role Id",
      dataIndex: "role_id",
      key: "role_id",
    },
  ];
  const prog_col = [
    {
      title: "Program Name",
      dataIndex: "program_name",
      key: "program_name",
      fixed: "left",
    },

    {
      title: "Minimum Age",
      dataIndex: "min_age",
      key: "min_age",
    },
    {
      title: "Maximum Age",
      dataIndex: "max_age",
      key: "max_age",
    },
  ];
  const [result, setResult] = useState(null);
  const navigateTo = useNavigate();

  useEffect(() => {
    answer();
  }, []);

  const answer = async () => {
    try {
      let result;
      switch (props.type) {
        case "Users":
          result = await getAxiosCall("/users");
          setResult(result?.data?.users);
          break;
        case "Inquiries":
          result = await getAxiosCall("/fetchInquiries");
          setResult(result?.data);
          break;
        case "Enrollments":
          result = await getAxiosCall("/fetchEnrollment");
          setResult(result?.data);
          break;
        case "Testimonials":
          result = await getAxiosCall("/fetchTestimonials");
          setResult(result?.data);
          break;
        case "Staff":
          result = await getAxiosCall("/fetchStaff");
          setResult(result?.data);
          break;
        case "Blogs":
          result = await getAxiosCall("/fetchBlogs");
          setResult(result?.data);
          break;
        case "Events":
          result = await getAxiosCall("/fetchEvents");
          setResult(result?.data);
          break;
        case "Programs":
          result = await getAxiosCall("/fetchPrograms");
          setResult(result?.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const deleteEnrollment = async (id) => {
    try {
      Swal.fire({
        title: "info",
        text: "Are You Sure You want to Delete This Enrollment",
        icon: "info",
        confirmButtonText: "Delete",
        showCancelButton: true,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAxiosCall("/deleteEnrollment", id);
          message.success("Enrollment deleted successfully");
          answer(); // Refresh the data after deletion
          setTimeout(() => {
            window.location.reload(true);
          }, 1000);
        }
      });
    } catch (error) {
      console.error("Error deleting Enrollment:", error);
      message.error("Failed to delete Enrollment");
    }
  };
  const deleteInquiry = async (id) => {
    try {
      Swal.fire({
        title: "info",
        text: "Are You Sure You want to Delete This Inquiry",
        icon: "info",
        confirmButtonText: "Delete",
        showCancelButton: true,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAxiosCall("/deleteInquiry", id);
          message.success("Inquiry deleted successfully");
          answer(); // Refresh the data after deletion
          setTimeout(() => {
            window.location.reload(true);
          }, 1000);
        }
      });
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      message.error("Failed to delete inquiry");
    }
  };

  const renderTable = () => {
    switch (props.type) {
      case "Events":
        return (
          <PageWrapper title={`${props.pageMode} Events`}>
            <Table
              columns={events_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo(
                    props.pageMode === "Delete"
                      ? "/deleteEventsinner"
                      : "/updateEventsinner",
                    { state: record }
                  );
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      case "Programs":
        return (
          <PageWrapper title={`${props.pageMode} Programs`}>
            <Table
              columns={prog_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo(
                    props.pageMode === "Delete"
                      ? "/deletePrograminner"
                      : "/updatePrograminner",
                    { state: record }
                  );
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      case "Enrollments":
        return (
          <>
            <PageWrapper title={`${props.type}`}>
              <Table
                columns={Enrollment_columns}
                dataSource={result}
                size="large"
                onRow={() => ({})}
                scroll={{ x: 1000, y: 1500 }}
              />
            </PageWrapper>
            <Modal
              open={openModal}
              title="Description"
              centered
              closeIcon
              maskClosable={true} // Ensures that clicking outside closes the modal
              closable={true} // Hides the "X" close button
              footer={null}
              destroyOnClose={true}
              onCancel={() => setopenModal(false)} // Add this line to close the modal when clicking outside
            >
              <p>{EnrMessage}</p>
            </Modal>
          </>
        );
      case "Inquiries":
        return (
          <>
            <PageWrapper title={`${props.type}`}>
              <Table
                columns={inquiry_columns}
                dataSource={result}
                size="large"
                onRow={() => ({})}
                scroll={{ x: 1000, y: 1500 }}
              />
            </PageWrapper>
            <Modal
              open={openModal}
              title="Description"
              centered
              closeIcon
              maskClosable={true} // Ensures that clicking outside closes the modal
              closable={true} // Hides the "X" close button
              footer={null}
              destroyOnClose={true}
              onCancel={() => setopenModal(false)} // Add this line to close the modal when clicking outside
            >
              <p>{inqMessage}</p>
            </Modal>
          </>
        );
      case "Testimonials":
        return (
          <PageWrapper title={`${props.type}`}>
            <Table
              columns={testimonials_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo("/deleteTestimonialsinner", { state: record });
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      case "Staff":
        return (
          <PageWrapper title={`${props.pageMode} Staff`}>
            <Table
              columns={staff_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo(
                    props.pageMode === "Delete" ? "/deleteStaffinner" : "",
                    { state: record }
                  );
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      case "Blogs":
        return (
          <PageWrapper title={`${props.pageMode} Blogs`}>
            <Table
              columns={blog_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo(
                    props.pageMode === "Delete"
                      ? "/deleteBlogsinner"
                      : "/updateBlogsinner",
                    { state: record }
                  );
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      case "Users":
        return (
          <PageWrapper title={`${props.pageMode} Users`}>
            <Table
              columns={user_col}
              dataSource={result}
              size="large"
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      default:
    }
  };

  return <>{renderTable()}</>;
}

export default ProductTable;
