import React from "react";
import Layout from "../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const Contact = () => {
  return (
    <Layout>
      <div className="container mt-5">
        <div className="row align-items-center">

          {/* LEFT IMAGE */}
          <div className="col-md-6">
            <img
              src="/images/contactus.jpeg"
              alt="contact"
              className="img-fluid rounded"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-md-6">
            <h1 className="bg-dark text-white text-center p-3 mb-4">
              CONTACT US
            </h1>

            <p className="text-muted">
              Any query and information about products, feel free to contact us anytime.
              We are available 24x7 to help you.
            </p>

            <p className="mt-3">
              <BiMailSend size={20} /> : help@ecommerceapp.com
            </p>

            <p className="mt-3">
              <BiPhoneCall size={20} /> : 012-3456789
            </p>

            <p className="mt-3">
              <BiSupport size={20} /> : 1800-0000-0000 (Toll Free)
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Contact;