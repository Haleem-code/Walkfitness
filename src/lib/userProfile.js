// src/app/lib/userProfile.js

// Mock function to simulate getting user profile data
export async function getUserProfile(userId) {
    return { userId, points: 100 }; // Returning 100 points for testing
  }
  
  // Mock function to simulate updating user profile data
  export async function updateUserProfile(userId, points) {
    return { userId, points }; // Returning the updated points for testing
  }
  