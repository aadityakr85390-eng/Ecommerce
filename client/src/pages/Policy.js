import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout>
      <div className="container contactus">
        <div className="row align-items-center">

          <div className="col-md-6">
            <img
              src="/images/contactus.jpeg"
              alt="privacy policy"
              style={{ width: "100%" }}
            />
          </div>

          <div className="col-md-6">
            <h1 className="bg-dark text-white text-center p-2">
              PRIVACY POLICY
            </h1>

            <p className="mt-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Ducimus officiis obcaecati esse tempore unde ratione.
            </p>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Eveniet mollitia, perferendis eius temporibus dicta.
            </p>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laborum enim accusantium atque excepturi sapiente amet.
            </p>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Policy;