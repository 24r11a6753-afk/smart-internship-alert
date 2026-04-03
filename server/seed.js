const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Opportunity = require('./models/Opportunity');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-internship';

const seedData = [
  {
    title: 'Software Engineering Intern, Summer 2026',
    company: 'Google',
    description: 'Join the Google SWE team to build the next generation of web applications. Strong algorithms and data structures experience required.',
    type: 'internship',
    category: 'Web Dev',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 30)), // 30 days from now
    link: 'https://careers.google.com/students/',
    location: 'Mountain View, CA (Hybrid)',
    isFeatured: true
  },
  {
    title: 'AI Research Intern',
    company: 'OpenAI',
    description: 'Work alongside world-class researchers on large language models and reinforcement learning.',
    type: 'internship',
    category: 'AI',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 14)), // 14 days from now
    link: 'https://openai.com/careers',
    location: 'San Francisco, CA',
    isFeatured: true
  },
  {
    title: 'CalHacks 13.0',
    company: 'UC Berkeley, Devpost',
    description: 'The worlds largest collegiate hackathon. Build amazing projects with thousands of hackers over 36 hours.',
    type: 'hackathon',
    category: 'Web Dev',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 5)), // 5 days from now
    link: 'https://calhacks.io/',
    location: 'Berkeley, CA / Remote',
    isFeatured: true
  },
  {
    title: 'Global Data Science Bowl',
    company: 'Kaggle',
    description: 'Predict the impact of climate events using structured datasets and win up to $100k in prizes.',
    type: 'hackathon',
    category: 'Data Science',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 60)), // 60 days
    link: 'https://kaggle.com/',
    location: 'Remote',
    isFeatured: false
  },
  {
    title: 'Cybersecurity Analyst Intern',
    company: 'CrowdStrike',
    description: 'Help defend against global cyber threats by analyzing malware and engineering secure systems.',
    type: 'internship',
    category: 'Cybersecurity',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 10)), // 10 days
    link: 'https://crowdstrike.com/careers',
    location: 'Austin, TX',
    isFeatured: false
  },
  {
    title: 'Web3 & Blockchain Hackathon Series',
    company: 'Ethereum Foundation',
    description: 'Build dApps, smart contracts, and decentralized finance solutions.',
    type: 'hackathon',
    category: 'Blockchain',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 2)),
    link: 'https://ethglobal.com/',
    location: 'Remote',
    isFeatured: true
  },
  {
    title: 'Software Development Engineer Intern (EMEA)',
    company: 'Amazon',
    description: 'Design and build massive scale, distributed, and highly available systems. Work on cutting-edge cloud infrastructure.',
    type: 'internship',
    category: 'Web Dev',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 45)),
    link: 'https://amazon.jobs/',
    location: 'London, UK',
    isFeatured: false
  },
  {
    title: 'Deep Learning Engineering Intern',
    company: 'DeepMind',
    description: 'Collaborate with researchers to scale foundational models and solve complex AI intelligence challenges.',
    type: 'internship',
    category: 'AI',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 12)),
    link: 'https://deepmind.google/careers/',
    location: 'London, UK',
    isFeatured: true
  },
  {
    title: 'APAC Hack \& Roll 2026',
    company: 'NUS Hackers',
    description: 'Singapores premier student-run hackathon. Bring your wildest ideas and turn them into reality.',
    type: 'hackathon',
    category: 'Web Dev',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 25)),
    link: 'https://hacknroll.nushackers.org/',
    location: 'Singapore',
    isFeatured: true
  },
  {
    title: 'Frontend Developer Intern',
    company: 'Canva',
    description: 'Help build intuitive interfaces used by millions of creators worldwide using React and modern CSS features.',
    type: 'internship',
    category: 'UI/UX',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 18)),
    link: 'https://www.canva.com/careers/',
    location: 'Sydney, Australia',
    isFeatured: false
  },
  {
    title: 'Data Engineering Intern',
    company: 'Spotify',
    description: 'Build and optimize pipelines processes millions of user signals to power our recommendation engines.',
    type: 'internship',
    category: 'Data Science',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 20)),
    link: 'https://lifeatspotify.com/jobs/',
    location: 'Stockholm, Sweden',
    isFeatured: false
  },
  {
    title: 'Tokyo AI Summit Hackathon',
    company: 'SoftBank Robotics',
    description: 'Develop next-gen robotic interfaces and AI automation scripts in this intense 48-hour challenge.',
    type: 'hackathon',
    category: 'AI',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 8)),
    link: 'https://www.softbankrobotics.com/',
    location: 'Tokyo, Japan',
    isFeatured: false
  },
  {
    title: 'Cyber Security Analyst Intern',
    company: 'NVIDIA',
    description: 'Focus on vulnerability analysis, threat modeling, and securing GPU infrastructure.',
    type: 'internship',
    category: 'Cybersecurity',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 22)),
    link: 'https://nvidia.wd5.myworkdayjobs.com/',
    location: 'Bangalore, India',
    isFeatured: true
  },
  {
    title: 'EU Space Tech Hackathon',
    company: 'European Space Agency',
    description: 'Utilize satellite imagery and atmospheric data to solve earth observation problems.',
    type: 'hackathon',
    category: 'Data Science',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 50)),
    link: 'https://www.esa.int/',
    location: 'Berlin, Germany',
    isFeatured: true
  },
  {
    title: 'Smart India Hackathon (SIH)',
    company: 'Govt of India',
    description: 'A nationwide initiative to provide students with a platform to solve some of the pressing problems we face in our daily lives.',
    type: 'hackathon',
    category: 'AI',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 35)),
    link: 'https://www.sih.gov.in/',
    location: 'New Delhi, India',
    isFeatured: true
  },
  {
    title: 'Software Engineer Intern (Cloud)',
    company: 'Microsoft India',
    description: 'Work with the Azure Core team to develop high-performance storage solutions at scale.',
    type: 'internship',
    category: 'Web Dev',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 28)),
    link: 'https://careers.microsoft.com/',
    location: 'Hyderabad, India',
    isFeatured: false
  },
  {
    title: 'Data Science Intern - GenAI',
    company: 'Swiggy',
    description: 'Apply generative AI to optimize delivery route models and improve customer chat experiences.',
    type: 'internship',
    category: 'Data Science',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 15)),
    link: 'https://careers.swiggy.com/',
    location: 'Bangalore, India',
    isFeatured: true
  },
  {
    title: 'Flipkart Grid 6.0 Robotics Challenge',
    company: 'Flipkart',
    description: 'Solve real e-commerce problems using computer vision and automation robotics.',
    type: 'hackathon',
    category: 'AI',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 10)),
    link: 'https://unstop.com/',
    location: 'Remote',
    isFeatured: true
  },
  {
    title: 'Full Stack Engineering Intern',
    company: 'Zomato',
    description: 'Help build scalable microservices handling millions of daily orders across India using Node.js and React.',
    type: 'internship',
    category: 'Web Dev',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 14)),
    link: 'https://careers.zomato.com/',
    location: 'Gurugram, India',
    isFeatured: false
  },
  {
    title: 'WIPRO Earthian Sustainability Hackathon',
    company: 'Wipro',
    description: 'Develop technical solutions focused on water conservation and carbon footprint reduction for smart cities.',
    type: 'hackathon',
    category: 'Data Science',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 40)),
    link: 'https://www.wipro.org/earthian',
    location: 'Pune, India',
    isFeatured: true
  },
  {
    title: 'Blockchain Developer Intern',
    company: 'Polygon Labs',
    description: 'Work on scaling solutions for Ethereum, build ZK-rollups technology, and contribute to Web3 ecosystem in India.',
    type: 'internship',
    category: 'Blockchain',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 21)),
    link: 'https://polygon.technology/careers',
    location: 'Bangalore, India',
    isFeatured: true
  },
  {
    title: 'TCS CodeVita Season 12',
    company: 'Tata Consultancy Services',
    description: 'Compete in the largest global computer programming competition, testing fundamental coding skills across multiple rounds.',
    type: 'hackathon',
    category: 'Web Dev',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 5)),
    link: 'https://tcscodevita.com/',
    location: 'Chennai, India',
    isFeatured: false
  },
  {
    title: 'Cyber Security Analyst Intern',
    company: 'Infosys',
    description: 'Get hands-on experience with threat modeling, vulnerability assessments, and managing enterprise security architectures.',
    type: 'internship',
    category: 'Cybersecurity',
    deadline: new Date(new Date().setHours(new Date().getHours() + 24 * 30)),
    link: 'https://www.infosys.com/careers/',
    location: 'Mysore, India',
    isFeatured: false
  }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Purging existing opportunities...');
    await Opportunity.deleteMany({});
    
    console.log('Inserting seed data...');
    const dataWithMode = seedData.map(item => ({
      ...item,
      mode: item.location && item.location.toLowerCase().includes('remote') ? 'Online' : 'Offline'
    }));
    await Opportunity.insertMany(dataWithMode);
    
    console.log('Successfully seeded real-world data!');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Error seeding data:', err);
    mongoose.disconnect();
  });
