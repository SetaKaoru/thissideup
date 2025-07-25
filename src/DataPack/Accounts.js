let nextId = 1;
export const generateId = (prefix = 'id') => `${prefix}_${nextId++}`;

export const initialUsers = [
  {
    _id: generateId('user'),
    name: "Edward Barry Robert",
    email: "Edward_BR@rocketmail.com",
    passwordHash: "E92f47e3",
    role: "Customer",
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId('user'),
    name: "Keiko Villanueva",
    email: "keikomori@gmail.com",
    passwordHash: "K3ikoMori2025",
    role: "Admin",
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId('user'),
    name: "Topaz Cifera",
    email: "TCifera@hotmail.com",
    passwordHash: "T0pazCifera!",
    role: "Customer",
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId('user'),
    name: "Rhys Welder",
    email: "rhys@gmail.com",
    passwordHash: "myhouse45!",
    role: "Customer",
    createdAt: new Date().toISOString(),
  },
   {
    _id: generateId('user'),
    name: "hippo",
    email: "hippo@gmail.com",
    passwordHash: "A123456aa!",
    role: "Customer",
    createdAt: new Date().toISOString(),
  },
  {
    _id: generateId('user'),
    name: "robot",
    email: "robot@gmail.com",
    passwordHash: "B123456zz!",
    role: "Admin",
    createdAt: new Date().toISOString(),
  },
];