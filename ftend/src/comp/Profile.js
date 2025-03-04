import React from 'react';
import { Pencil, MapPin, Venus, Cake, Phone, Mail } from "lucide-react";
import '../comp/Profile.css';

const Profile = () => {
  return (
    <div className='profilemaincontainer'>
      <div className='usercontainer'>
        <div className='profilepic'>
          <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbetwQneC6C9tp5Eks7MN7ZbRNqwyVOcW47Q&s' alt="Profile" />
        </div>
        <div className='personaldetails'>
          <h3>Thallapally Harshavardhan <Pencil size={20}  /></h3>
          <h5>B.Tech</h5>
          <p>Jyothismathi Institute of Technology and Science, Karimnagar</p>
          <hr />
          <div className='details'>
            <div>
              <span><MapPin size={20} /> Hyderabad</span>
              <span><Venus size={20} /> Male</span>
              <span><Cake size={20} color="orange" />14/06/2001</span>
            </div>
            <div style={{width:"0.1px",border:"0.5px solid gray"}}></div>
            <div>
              <span><Phone size={18} /> 1234567892</span>
              <span><Mail size={18} /> Thallapallyharshavard..</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;