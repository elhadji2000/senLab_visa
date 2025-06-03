import React from 'react';
import { motion } from 'framer-motion';
import TeamMemberCard from '../components/TeamMemberCard';
import './About.css';

// Données des membres de l'équipe avec images en ligne
// Données des membres de l'équipe
const teamMembers = [
  {
    id: 1,
    name: "Dr. Sophie Martin",
    role: "Directrice Scientifique",
    expertise: "Biologie Moléculaire",
    bio: "15 ans d'expérience en recherche virtuelle. PhD en Biotechnologie.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
  },
  {
    id: 2,
    name: "Pierre Lambert",
    role: "Ingénieur Simulation",
    expertise: "Modélisation 3D",
    bio: "Spécialiste des environnements virtuels pour expériences scientifiques.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
  },
  {
    id: 3,
    name: "Fatima Diallo",
    role: "Responsable IA",
    expertise: "Machine Learning",
    bio: "Développe des algorithmes d'IA pour l'analyse scientifique.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
  },
  {
    id: 4,
    name: "Thomas Dubois",
    role: "Designer VR",
    expertise: "Expérience Utilisateur",
    bio: "Crée des interfaces immersives pour nos labos virtuels.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
  }
];

// Animation variants
const cardVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};
// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      when: "beforeChildren"
    }
  }
};

function TeamMember({ member }) {
  return (
    <motion.div
      className="team-member-card"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
    >
      <div className="member-image">
        <img src={member.image} alt={member.name} />
      </div>
      <div className="member-info">
        <h3>{member.name}</h3>
        <p className="role">{member.role}</p>
        <p className="expertise">{member.expertise}</p>
        <p className="bio">{member.bio}</p>
      </div>
    </motion.div>
  );
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

function About() {
  return (
    <motion.div
      className="about-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Section Hero avec animation */}
      <motion.section
        className="hero-section"
        variants={itemVariants}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            SenLab - Innovation Virtuelle en Science
          </motion.h1>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Pionniers dans les laboratoires virtuels pour une recherche accessible et collaborative
          </motion.p>
        </div>
        <motion.div
          className="hero-image"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <img
            src="https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            alt="Laboratoire virtuel SenLab"
          />
        </motion.div>
      </motion.section>

      {/* Section Mission */}
      <motion.section
        className="mission-section"
        variants={itemVariants}
      >
        <motion.h2
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Notre Mission
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Chez SenLab, nous révolutionnons la recherche scientifique en offrant un environnement de
          laboratoire virtuel complet, accessible à tout moment et depuis n'importe où. Notre plateforme
          combine les dernières technologies de simulation avec des outils collaboratifs pour accélérer
          les découvertes scientifiques.
        </motion.p>

        <motion.div
          className="mission-images"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1581093057305-25a0a5c02344?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            alt="Technologie de laboratoire"
            whileHover={{ scale: 1.03 }}
          />
          <motion.img
            src="https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            alt="Équipe scientifique"
            whileHover={{ scale: 1.03 }}
          />
          <motion.img
            src="https://images.unsplash.com/photo-1581093052921-178d0c4f4fdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            alt="Analyse de données"
            whileHover={{ scale: 1.03 }}
          />
        </motion.div>
      </motion.section>

      {/* Section Technologies */}
      <motion.section
        className="tech-section"
        variants={itemVariants}
      >
        <h2>Nos Technologies Innovantes</h2>
        <div className="tech-grid">
          {[
            {
              title: "Simulation moléculaire en temps réel",
              icon: "🧪",
              image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
              title: "Réalité virtuelle immersive",
              icon: "👓",
              image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
              title: "IA pour l'analyse des données",
              icon: "🤖",
              image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
              title: "Collaboration en temps réel",
              icon: "👥",
              image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
              title: "Banque de données expérimentales",
              icon: "💾",
              image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
              title: "Outils de visualisation 3D",
              icon: "📊",
              image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            }
          ].map((tech, index) => (
            <motion.div
              key={index}
              className="tech-card"
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="tech-image">
                <img src={tech.image} alt={tech.title} />
              </div>
              <div className="tech-icon">{tech.icon}</div>
              <h3>{tech.title}</h3>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section Équipe */}
      {/* Section Équipe simplifiée */}
      <section className="team-section">
        <h2>Notre Équipe d'Experts</h2>
        <p className="section-subtitle">
          Des professionnels passionnés par l'innovation scientifique virtuelle
        </p>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* Section Chiffres */}
      <motion.section
        className="stats-section"
        variants={itemVariants}
      >
        <h2>SenLab en Chiffres</h2>
        <div className="stats-grid">
          {[
            {
              value: "50+",
              label: "Projets de recherche",
              icon: "📈"
            },
            {
              value: "200+",
              label: "Utilisateurs actifs",
              icon: "👨‍🔬"
            },
            {
              value: "15",
              label: "Pays desservis",
              icon: "🌍"
            },
            {
              value: "24/7",
              label: "Accessibilité",
              icon: "⏱️"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 * index }}
            >
              <motion.p
                className="stat-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.1 * index
                }}
              >
                {stat.icon}
              </motion.p>
              <motion.p
                className="stat-value"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.1 * index
                }}
              >
                {stat.value}
              </motion.p>
              <p className="stat-label">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="cta-content">
          <h2>Prêt à rejoindre la révolution scientifique virtuelle ?</h2>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            Contactez-nous
          </motion.button>
        </div>
        <div className="cta-image">
          <img
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Équipe scientifique collaborant"
          />
        </div>
      </motion.section>
    </motion.div>
  );
}

export default About;