import { getFirestore } from "firebase-admin/firestore";

/**
 * Helper function to generate a random 6-character uppercase alphanumeric string (e.g. "X7K9P2")
 */
function generateTeamId(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

/**
 * Function 1: createTeam(teamName, leadId)
 * Generates a random 6-character teamId, creates a new team document in the "teams" collection,
 * and updates the lead user's document in the "users" collection with this teamId.
 */
export async function createTeam(teamName: string, leadId: string) {
  // Step 1: Get the Firestore database instance
  const db = getFirestore();

  // Step 2: Generate a 6-character team code
  const teamId = generateTeamId();

  // Step 3: Add a new document into the "teams" collection
  const teamRef = await db.collection("teams").add({
    name: teamName,
    teamId: teamId,
    leadId: leadId,
    createdAt: new Date().toISOString(),
  });

  // Step 4: Update the lead user's document in the "users" collection to attach the teamId
  await db.collection("users").doc(leadId).set(
    {
      teamId: teamId,
      role: "lead",
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  // Step 5: Return the created team object
  return {
    documentId: teamRef.id,
    teamId: teamId,
    name: teamName,
    leadId: leadId,
  };
}

/**
 * Function 2: requestToJoinTeam(teamId, userId)
 * Creates a new document in the "joinRequests" collection with teamId, userId, and status set to 'pending'.
 */
export async function requestToJoinTeam(teamId: string, userId: string) {
  // Step 1: Get the Firestore database instance
  const db = getFirestore();

  // Step 2: Add a new join request document into the "joinRequests" collection
  const requestRef = await db.collection("joinRequests").add({
    teamId: teamId,
    userId: userId,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  // Step 3: Return the created request object
  return {
    requestId: requestRef.id,
    teamId: teamId,
    userId: userId,
    status: "pending",
  };
}

/**
 * Function 3: approveJoinRequest(requestId, userId, teamId)
 * Updates the status of the request in "joinRequests" to 'approved',
 * and updates the user's document in "users" collection to include the teamId.
 */
export async function approveJoinRequest(requestId: string, userId: string, teamId: string) {
  // Step 1: Get the Firestore database instance
  const db = getFirestore();

  // Step 2: Update status to 'approved' in the "joinRequests" collection using update()
  await db.collection("joinRequests").doc(requestId).update({
    status: "approved",
    updatedAt: new Date().toISOString(),
  });

  // Step 3: Update the user's document in the "users" collection to include teamId and role 'member'
  await db.collection("users").doc(userId).set(
    {
      teamId: teamId,
      role: "member",
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  // Step 4: Return success confirmation
  return {
    success: true,
    requestId: requestId,
    userId: userId,
    teamId: teamId,
    status: "approved",
  };
}
