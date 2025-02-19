export const mockFirebaseAdmin = () => {
  const mockFirestore = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
    add: jest.fn().mockResolvedValue({ id: 'mockId' }),
    where: jest.fn().mockReturnThis(),
  };

  return {
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn(),
    },
    firestore: jest.fn(() => mockFirestore),
    apps: { length: 0 },
  };
};
