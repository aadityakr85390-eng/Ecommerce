import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout >
      <div className="container contactus">
        <div className="row align-items-center">

          <div className="col-md-6">
            <img
              src="/images/about.jpeg"
              alt="about"
            />
          </div>

          <div className="col-md-6">
            <p className="mt-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Ducimus officiis obcaecati esse tempore unde ratione,
              eveniet mollitia, perferendis eius temporibus dicta
              blanditiis doloremque explicabo quasi sunt vero optio
              cum aperiam vel consectetur! Laborum enim accusantium
              atque, excepturi sapiente amet! Tenetur ducimus aut
              commodi illum quidem neque tempora nam.
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default About;