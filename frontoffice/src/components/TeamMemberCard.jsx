import React from 'react';
import { motion } from 'framer-motion';

const TeamMemberCard = ({ member }) => {
  return (
    <motion.div 
      className="team-member-card"
      variants={{
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      whileHover={{ 
        y: -10,
        boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
      }}
    >
      <div className="member-image-container">
        <motion.img 
          src={member.image} 
          alt={member.name}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="member-info">
        <h3>{member.name}</h3>
        <p className="role">{member.role}</p>
        <p className="expertise">{member.expertise}</p>
        <p className="bio">{member.bio}</p>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;