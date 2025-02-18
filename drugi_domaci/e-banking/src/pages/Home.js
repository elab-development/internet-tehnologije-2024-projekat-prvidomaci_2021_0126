import React from 'react'
import '../style/Home.css';

function Home({user}) {
    return (

        <h1>Welcome {user.firstName}!</h1>
    );

}

export default Home
