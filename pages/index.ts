import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Nav } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';

const NavLink = React.forwardRef((props, ref) => {
  const { as, href, ...rest } = props;
  return (
    <Link href={href} as={as}>
      <a ref={ref} {...rest} />
    </Link>
  );
});

const Home = () => (
  <div>
    <Head>
      <title>NAR - Next Auto Rest</title>
    </Head>

    <div className="hero">
      <h1 className="title">NAR - Next Auto Rest</h1>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
        padding: 50px;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
    `}</style>
  </div>
);

export default Home;
