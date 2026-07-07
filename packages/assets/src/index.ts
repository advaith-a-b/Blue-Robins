// Shared stock illustration and mock asset URLs matching the user's reference designs
export const IMAGES = {
  // Projects
  heartFailure: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80', // Padlock/Server visual
  drones: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&q=80', // Quadcopter drone
  windTunnels: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=500&q=80', // Wind turbine/energy source
  dancePose: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80', // Dance timing / pose estimation

  // Avatars
  studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', // Pooja Jain (Student)
  mentorAvatar1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', // Yashvi (Mentor)
  mentorAvatar2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', // Anirudh S (Mentor)
  mentorAvatar3: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', // John Walker (Mentor)
  parentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80', // Parent (Mr. Jain)
  adminAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80', // Admin User

  // Badges
  badgeWelcome: 'https://img.icons8.com/color/150/000000/owl.png', // Blue Owl/Robin character
  badgeOnARoll: 'https://img.icons8.com/color/150/000000/penguin.png',
  badgeRockstar: 'https://img.icons8.com/color/150/000000/falcon.png',
} as const;

export const LOGO_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
`;
