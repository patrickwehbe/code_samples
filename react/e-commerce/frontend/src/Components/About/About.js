import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './About.css';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

function About() {
  return (
    <div className="about">
      <div className="infos">
        <div className="">
          <div
            className="first__section"
            style={{
              width: '60%',
              marginLeft: '25%',
              paddingBottom: '5vh',
            }}
          >
            <h3>About Us</h3>
            NitchD is innovating your online shopping experience. Our mission is
            to collaborate with your favorite online shops while providing a
            friendly experience by cutting off the hassle of going from one
            platform to another just to purchase your next item. Connecting you
            to a wide range of clothing items from various local and
            international shops. Our goal is simple, we want to deliver a fast,
            convenient and memorable fashion shopping experience for our
            customers. Lets’ invest in our resilient fashion industry by
            supporting our local shops and designers.
          </div>
        </div>
        <div className="" style={{ background: ' #f2f2f1 ' }}>
          <div
            className="third__section"
            style={{
              paddingBottom: '2vh',
              textAlign: 'left',
              marginLeft: '25%',
            }}
          >
            <h2>Join Us</h2>
            <p>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                E-mail:
              </span>
              Info@nitchd.com.
            </p>
            <p style={{ display: 'flex', flexDirection: 'row' }}>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                Phone Number:
              </span>
              <div>
                <p style={{ margin: '0px', marginBottom: '5px' }}>
                  +961 01 752 071
                </p>
                <p style={{ margin: '0px', marginBottom: '5px' }}>
                  +961 71 695 550
                </p>
                <p style={{ margin: '0px' }}>+961 71 390 888</p>
              </div>
            </p>
            <p>
              Email us the name and URL of your website or page. We will review
              your site and respond to your e-mail within seven days with
              further information on how to join the affiliate program
            </p>
          </div>
        </div>

        <div
          className="second__section"
          style={{
            height: 'auto',
            width: '100vw',
            height: 'fit-content',
          }}
        >
          <div
            className=""
            style={{
              height: '20vh',
              paddingTop: '1vh',
              height: 'fit-content',
            }}
          >
            <div
              className=""
              style={{
                width: '50%',
                margin: 'auto',
                height: 'fit-content',
              }}
            >
              <h2 style={{}}>Affiliates</h2>
              <p style={{}}>
                We are looking for innovative, fashion-forward, stylish websites
                and blogs from around Lebanon– in particular, those that
                specialize in fashion, lifestyle, beauty and design to join our
                global affiliate program.{' '}
              </p>
            </div>
          </div>
          <div
            className=""
            style={{
              background: ' #f2f2f1 ',
              height: 'fit-content',
              paddingTop: '1vh',
              paddingBottom: '3px',
            }}
          >
            <div
              className=""
              style={{
                width: '50%',
                margin: 'auto',
                height: 'fit-content',
              }}
            >
              <h3>What are the Benefits? </h3>
              <p style={{ height: 'fit-content' }}>
                Free to join Competitions and giveaways Regular newsletters
                about new product arrivals, new boutiques, features and offers
                About NitchD NitchD is an online platform for online shopping.
                Through our website we will offer a virtual-mall like experience
                where your products will be displayed. We also offer delivery
                services, warehousing and our very own photography team.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="logos">
        <Grid container justify="space-between" alignContent="center">
          {logoData.map((logoContent) => {
            return (
              <Grid container xs={12} md={2} justify="center">
                <img src={logoContent.imageUrl} alt="" />
              </Grid>
            );
          })}
        </Grid>
      </div> */}
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <img src="" alt="" />
        </Grid>
      </Grid>
      <div className="faqs__accordion" style={{ paddingBottom: '10vh' }}>
        <h2 style={{ textAlign: 'center', paddingBottom: '5vh' }}>FAQs</h2>
        <h4
          style={{
            paddingBottom: '4vh',
            paddingTop: '4vh',
          }}
        >
          Orders:
        </h4>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              <div
                style={{
                  textAlign: 'center',
                  width: '90vw',
                }}
              >
                Q: Can I order my products immediately through the website?
              </div>
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Typography>
              <div style={{ textAlign: 'center', width: '90vw' }}>
                A: Yes, orders can be put through our website.
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion style={{ textAlign: 'center' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{ textAlign: 'center' }}
          >
            <Typography align="center">
              <div style={{ textAlign: 'center', width: '90vw' }}>
                Q: Can I track my order once it is up for delivery?
              </div>
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Typography>
              <div style={{ textAlign: 'center', width: '90vw' }}>
                A: All orders can be tracked and a driver will be in contact
                with the client once the product is on its way.
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <h4
          style={{
            paddingBottom: '4vh',
            paddingTop: '4vh',
          }}
        >
          Payments and Pricings
        </h4>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              <div style={{ textAlign: 'center', width: '90vw' }}>
                Q: Will the prices of all products be available on the website?
              </div>
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Typography>
              <div style={{ textAlign: 'center', width: '90vw' }}>
                A: All products on the NitchD website, unless customizable will
                be shared on the website. Custom-made products will have prices
                set once ordered.
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              <div style={{ textAlign: 'center', width: '90vw' }}>
                Q: How do I pay for my products?{' '}
              </div>
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Typography>
              <div style={{ textAlign: 'center', width: '90vw' }}>
                A: Products are paid cash on delivery.
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <h4
          style={{
            paddingBottom: '4vh',
            paddingTop: '4vh',
          }}
        >
          Return Policy
        </h4>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              <div style={{ textAlign: 'center', width: '90vw' }}>
                Q: Is there any return policy for products?
              </div>
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Typography>
              <div style={{ textAlign: 'center', width: '90vw' }}>
                A: The return policy of products depends on the brand you
                purchase the product from and its own return policy.
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <h4
          style={{
            paddingBottom: '4vh',
            paddingTop: '4vh',
          }}
        >
          Becoming a NitchD partner
        </h4>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              <div style={{ textAlign: 'center', width: '90vw' }}>
                Q: Can my brand become a NitchD partner?
              </div>
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Typography>
              <div style={{ textAlign: 'center', width: '90vw' }}>
                A: For information on how to become a NitchD partner please
                contact us on Info@nitchd.com or on our Instagram page.
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}

export default About;
