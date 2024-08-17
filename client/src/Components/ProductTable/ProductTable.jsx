import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import PageWrapper from "../PageContainer/PageWrapper";
import { getAxiosCall, deleteAxiosCall } from "../../Axios/UniversalAxiosCalls";
import { useNavigate } from "react-router-dom";

function ProductTable(props) {
  const columns = [
    {
      title: "Prd ID",
      dataIndex: "prd_id",
      key: "prd_id",
      fixed: "left",
    },
    {
      title: "Exhibition Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Booth Size",
      dataIndex: "booth_size",
      key: "booth_size",
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
    },
  ];

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
        <Button onClick={() => deleteInquire(record.inquiry_id)}>Delete</Button>
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
  const [result, setResult] = useState(null);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!props.filteredProducts) {
      answer();
    } else {
      setResult(props.filteredProducts);
    }
  }, [props]);

  const answer = async () => {
    try {
      if (props.type === "Inquiries") {
        const result = await getAxiosCall("/fetchInquiries");
        setResult(result.data);
      } else if (props.type == "Testimonials") {
        const result = await getAxiosCall("/fetchTestimonials");
        setResult(result.data);
      } else if (props?.type == "Staff") {
        const result = await getAxiosCall("/fetchStaff");
        setResult(result.data);
      } else if (props?.type == "Blogs") {
        const result = await getAxiosCall("/fetchBlogs");

        setResult(result.data);
      } else {
        const result = await getAxiosCall("/fetchEvents");
        setResult(result.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteInquire = async (id) => {
    try {
      const remove = await deleteAxiosCall("/deleteInquiry", id);
      message.success("Inquiry deleted successfully");
      answer(); // Refresh the data after deletion
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
      case "Inquiries":
        return (
          <PageWrapper title={`${props.type}`}>
            <Table
              columns={inquiry_columns}
              dataSource={result}
              size="large"
              onRow={() => ({})}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
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
      default:
    }
  };

  return <>{renderTable()}</>;
}

export default ProductTable;
