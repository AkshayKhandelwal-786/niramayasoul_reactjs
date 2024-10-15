import React from 'react';

function Team() {
  return (
    <section className="bg-green position-relative mt-lg-5 mt-2">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="heading text-center mb-70">
              <span className="text-uppercase">Team</span>
              <h2 className="pb-0">Core Team</h2>
            </div>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 gy-lg-auto gy-4">
          <div className="col">
            <div className="card">
              <div className="card-profile position-relative">
                <img className="postop" src="/img/wave.svg" alt="Wave" />
                <div className="profile">
                  <img src="/img/founders/SubhayuRoy.png" alt="Subhayu Roy" />
                </div>
                <h3>Subhayu Roy</h3>
                <span>CEO &amp; Co-Founder</span>
                <div className="social-card d-flex justify-content-center">
                  <a href="https://www.linkedin.com/in/subhayu-roy-0b925727" target="_blank" rel="noopener noreferrer">
                    <img src="/img/LinkedIn.svg" alt="LinkedIn" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-profile position-relative">
                <img className="postop" src="/img/wave.svg" alt="Wave" />
                <div className="profile">
                  <img className="img-fluid w-100" src="/img/founders/AniruddhaRoy.png" alt="Aniruddha Roy" />
                </div>
                <h3>Aniruddha Roy</h3>
                <span>Co-Founder / COO</span>
                <div className="social-card d-flex justify-content-center">
                  <a href="https://www.linkedin.com/in/aniruddha-roy-a6828292/" target="_blank" rel="noopener noreferrer">
                    <img src="/img/LinkedIn.svg" alt="LinkedIn" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-profile position-relative">
                <img className="postop" src="/img/wave.svg" alt="Wave" />
                <div className="profile">
                  <img src="/img/founders/SabyasachiRoy.png" alt="Sabyasachi Roy" />
                </div>
                <h3>Sabyasachi Roy</h3>
                <span>Co-Founder / CMO</span>
                <div className="social-card d-flex justify-content-center">
                  <a href="https://www.linkedin.com/in/sabyasachi-roy-675b57200" target="_blank" rel="noopener noreferrer">
                    <img src="/img/LinkedIn.svg" alt="LinkedIn" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-profile position-relative">
                <img className="postop" src="/img/wave.svg" alt="Wave" />
                <div className="profile">
                  <img src="/img/founders/SangeethaMadhavan.jpeg" alt="Sangeetha Madhavan" />
                </div>
                <h3>Sangeetha Madhavan</h3>
                <span>Co-Founder / CTO</span>
                <div className="social-card d-flex justify-content-center">
                  <a href="https://www.linkedin.com/in/sangeetha-madhavan-8370b054/" target="_blank" rel="noopener noreferrer">
                    <img src="/img/LinkedIn.svg" alt="LinkedIn" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-profile position-relative">
                <img className="postop" src="/img/wave.svg" alt="Wave" />
                <div className="profile">
                  <img src="/img/founders/SaunakGhosh.png" alt="Saunak Ghosh" />
                </div>
                <h3>Saunak Ghosh</h3>
                <span>Mentor and Advisor</span>
                <div className="social-card d-flex justify-content-center">
                  <a href="https://www.linkedin.com/in/saunak-ghosh-60a5824/" target="_blank" rel="noopener noreferrer">
                    <img src="/img/LinkedIn.svg" alt="LinkedIn" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Team;
