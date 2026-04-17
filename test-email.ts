import { sendEmail } from "./lib/mail";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function test() {
  try {
    const adminEmail = process.env.SMTP_FROM_EMAIL;
    
    console.log("Sending email 1 (To Admin)...");
    const res1 = await sendEmail(adminEmail!, "Test Subject Admin", "<p>Test Html Admin</p>");
    console.log("Success 1:", res1.accepted);

    console.log("Sending email 2 (To User)...");
    const res2 = await sendEmail("deepak.test55@yopmail.com", "Test Subject User", "<p>Test Html User</p>");
    console.log("Success 2:", res2.accepted);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
