import React from "react";

import Header from './Header/Header';
import Footer from './Footer/Footer';

const Home = () => {
    return (
        <div class="container">
            <Header />
            <main>
                <hi>Hello, world!</hi>
            </main>
            <Footer />
        </div>
    );
};

export default Home;