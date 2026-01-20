**Expert Consultation Booking** is a services feature that lets a user (1) submit a consultation request and (2) *select a preferred available time slot up front*, while keeping the appointment **“pending approval”** until your admin team confirms it.

This hybrid approach gives users the speed and clarity of real-time availability, but preserves your control to:

* approve the chosen slot,

* propose alternative slots, or

* request more information before confirming.

---

## **What the feature includes**

### **User-facing (Services → Book an Appointment)**

* **Step 1: Consultation type**

  * Issue/category (dropdown)

  * Visa category (dropdown)

  * Case stage (USCIS / NVC / Interview / 221(g) / AP / Post-interview)

  * Urgency (Normal / Urgent \+ optional date trigger)

  * Preferred language (English/Urdu)

* **Step 2: Contact \+ case summary**

  * Full name

  * Email

  * WhatsApp phone

  * Detailed message box (their situation)

  * Optional: attachments (221(g) letter, CEAC screenshot, etc.)

* **Step 3: Choose a slot (essential)**

  * Show **available slots**

  * User selects one → shown clearly as **“Requested time (pending approval)”**

  * Optional backup: “If this slot isn’t available, here are 2 alternates” (nice-to-have)

* **After submission**

  * Confirmation screen \+ reference ID

  * Status shown: **Pending review / Needs more info / Alternative times proposed / Confirmed**

---

## **Essential workflow (end-to-end)**

### **1\) User flow**

1. User clicks **Services → Book an Appointment**

2. Selects issue \+ visa info \+ stage \+ language

3. Enters contact details \+ message (+ optional attachments)

4. **Selects an available slot**

5. Clicks **Request Appointment**

6. Sees: **“Request received — pending approval”** \+ reference ID

### **2\) System actions**

* Creates a request in your **admin portal**

* Marks the selected slot as **“Held / Pending approval”** (temporary lock, to avoid double-booking)

* Sends user an acknowledgment (email/WhatsApp):

  * “We received your request”

  * “Your selected slot is pending approval”

  * Link to view status / modify request (optional)

### **3\) Admin flow**

1. Admin reviews request details \+ attachments

2. Admin chooses one action:

   * **Approve** selected slot → status becomes **Confirmed**

   * **Propose alternatives** (1–3 options) → status becomes **Alternatives proposed**

   * **Request more info** → status becomes **Needs more info**

3. When confirmed:

   * System sends final confirmation:

     * Date/time \+ timezone

     * Meeting method (Zoom/Google Meet/WhatsApp call)

     * Reschedule/cancel link (if enabled)

   * Slot becomes fully booked (no longer pending)

---

## **Key behavior rules** 

* **Pending slot hold expires** after X minutes/hours if not approved (prevents stale holds).

* **Verification** (light anti-spam): email/OTP or WhatsApp confirmation.

* **Clear disclaimers**: not legal advice, no guarantee of outcome, privacy consent.

