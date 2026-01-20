// import { NextResponse } from "next/server";
// import * as cheerio from "cheerio";

// // Define the result interface
// interface VisaStatusResult {
//   status: string;
//   caseNumber: string;
//   applicationType: string;
//   location: string;
//   statusDate: string;
//   message: string;
//   additionalInfo?: string;
// }

// /**
//  * Function to scrape the CEAC status tracker website
//  * This handles the actual form submission to get real data
//  */
// async function scrapeCEACStatus(
//   applicationType: string,
//   caseNumber: string,
//   passportNumber: string,
//   surname: string
// ): Promise<VisaStatusResult | null> {
//   try {
//     // CEAC status tracker URL
//     const url = "https://ceac.state.gov/CEACStatTracker/Status.aspx";

//     // First, fetch the initial page to get hidden form fields (ViewState, EventValidation, etc.)
//     const initialResponse = await fetch(url, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//         'Accept-Language': 'en-US,en;q=0.5',
//         'Accept-Encoding': 'gzip, deflate, br',
//         'Connection': 'keep-alive',
//         'Upgrade-Insecure-Requests': '1',
//       },
//       cache: 'no-store',
//     });

//     if (!initialResponse.ok) {
//       console.error(`Failed to load CEAC page: ${initialResponse.status} ${initialResponse.statusText}`);
//       return null;
//     }

//     const html = await initialResponse.text();
//     const $ = cheerio.load(html);

//     // Extract hidden form fields required by ASP.NET
//     const viewState = $('#__VIEWSTATE').val() as string || '';
//     const viewStateGenerator = $('#__VIEWSTATEGENERATOR').val() as string || '';
//     const eventValidation = $('#__EVENTVALIDATION').val() as string || '';

//     // Prepare form data for submission
//     const formData = new URLSearchParams();
//     formData.append('__EVENTTARGET', '');
//     formData.append('__EVENTARGUMENT', '');
//     formData.append('__VIEWSTATE', viewState);
//     formData.append('__VIEWSTATEGENERATOR', viewStateGenerator);
//     formData.append('__EVENTVALIDATION', eventValidation);

//     // Set the application type (IV or NIV)
//     formData.append('ctl00$ContentPlaceHolder1$ddlVisaClass', applicationType);

//     // Set the case number
//     formData.append('ctl00$ContentPlaceHolder1$txtCaseNumber', caseNumber);

//     // Set passport number and surname
//     formData.append('ctl00$ContentPlaceHolder1$txtPassport', passportNumber);
//     formData.append('ctl00$ContentPlaceHolder1$txtLastName', surname);

//     // Set the submit button
//     formData.append('ctl00$ContentPlaceHolder1$btnSubmit', 'Check Status');

//     // Submit the form to CEAC
//     const submitResponse = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//         'Accept-Language': 'en-US,en;q=0.5',
//         'Accept-Encoding': 'gzip, deflate, br',
//         'Referer': url,
//         'Origin': 'https://ceac.state.gov',
//         'Connection': 'keep-alive',
//         'Upgrade-Insecure-Requests': '1',
//       },
//       body: formData.toString(),
//       cache: 'no-store',
//     });

//     if (!submitResponse.ok) {
//       console.error(`Failed to submit form: ${submitResponse.status} ${submitResponse.statusText}`);
//       return null;
//     }

//     const resultHtml = await submitResponse.text();

//     // Check if the response contains common error indicators
//     if (resultHtml.toLowerCase().includes('the specified network password is not correct') ||
//         resultHtml.toLowerCase().includes('access denied') ||
//         resultHtml.toLowerCase().includes('security violation') ||
//         resultHtml.toLowerCase().includes('bot detected') ||
//         resultHtml.toLowerCase().includes('captcha') ||
//         submitResponse.status === 403 ||
//         submitResponse.status === 429) {
//       console.error('CEAC responded with security/blocking page');
//       return null;
//     }

//     const result$ = cheerio.load(resultHtml);

//     // Look for error messages first
//     const errorMessage = result$('.errorMessage, .alert-danger, .error-message, .validation-summary-errors');
//     if (errorMessage.length > 0) {
//       const errorMsgText = errorMessage.first().text().trim();
//       if (errorMsgText && !errorMsgText.toLowerCase().includes('no data')) {
//         console.log(`CEAC returned error: ${errorMsgText}`);
//         // If it's a validation error about the inputs, return null to show user error
//         if (errorMsgText.toLowerCase().includes('case number') ||
//             errorMsgText.toLowerCase().includes('passport') ||
//             errorMsgText.toLowerCase().includes('surname') ||
//             errorMsgText.toLowerCase().includes('invalid') ||
//             errorMsgText.toLowerCase().includes('not found')) {
//           return null;
//         }
//       }
//     }

//     // Try to find the status information on the page
//     // CEAC typically shows status in specific elements after form submission
//     let status = '';
//     let location = '';
//     let statusDate = '';
//     let message = '';
//     let additionalInfo = '';

//     // Look for common patterns where CEAC displays status
//     const statusElements = result$('.status, .result, .info, .panel, .well, #statusResult, .case-status, .success, .alert-success');

//     if (statusElements.length > 0) {
//       // Try to extract status information
//       statusElements.each((i, elem) => {
//         const text = result$(elem).text().trim();
//         if (text.toLowerCase().includes('status') || text.toLowerCase().includes('ready') ||
//             text.toLowerCase().includes('approved') || text.toLowerCase().includes('refused') ||
//             text.toLowerCase().includes('in process') || text.toLowerCase().includes('issued')) {
//           status = text.substring(0, 100); // Limit length
//           return false; // Break loop
//         }
//       });
//     }

//     // Alternative: Look for specific status patterns in the whole document
//     const bodyText = result$('body').text().toLowerCase();

//     if (bodyText.includes('ready for interview')) {
//       status = 'Ready for Interview';
//       message = 'Your application has been processed and is ready for the next step.';
//     } else if (bodyText.includes('administrative processing')) {
//       status = 'Administrative Processing';
//       message = 'Your application requires additional administrative processing.';
//     } else if (bodyText.includes('approved') || bodyText.includes('granted')) {
//       status = 'Approved';
//       message = 'Your visa application has been approved.';
//     } else if (bodyText.includes('refused') || bodyText.includes('denied')) {
//       status = 'Refused';
//       message = 'Your visa application has been refused.';
//     } else if (bodyText.includes('in process') || bodyText.includes('being processed')) {
//       status = 'In Process';
//       message = 'Your application is currently being reviewed by our officers.';
//     } else if (bodyText.includes('issued') || bodyText.includes('visa issued')) {
//       status = 'Issued';
//       message = 'Your visa has been issued and is ready for pickup.';
//     } else if (bodyText.includes('complete') || bodyText.includes('completed')) {
//       status = 'Complete';
//       message = 'Your case processing is complete.';
//     } else if (bodyText.includes('pending')) {
//       status = 'Pending';
//       message = 'Your application is currently pending additional review.';
//     } else {
//       // If we can't determine the status from keywords, try to extract any status-like text
//       const possibleStatus = result$('h1, h2, h3, .status, .alert, .panel-title, .result, .success').first().text().trim();
//       if (possibleStatus && possibleStatus.toLowerCase() !== 'home' && possibleStatus.toLowerCase() !== 'status') {
//         status = possibleStatus;
//       } else {
//         // If no clear status found, the page might contain an error or no data message
//         if (bodyText.includes('no data') || bodyText.includes('not found') || bodyText.includes('invalid') || bodyText.includes('incorrect')) {
//           console.log('CEAC returned: No data found or invalid information');
//           return null;
//         }

//         // As a fallback, return a generic status if we found some content
//         const content = result$('body').text().substring(0, 200).trim();
//         if (content && content.length > 50) {  // If we got substantial content
//           status = 'Information Retrieved';
//           message = 'Status information has been retrieved from the system.';
//         } else {
//           return null; // No meaningful data retrieved
//         }
//       }
//     }

//     // Try to find location information
//     const locationPatterns = [/embassy.*?([A-Za-z\s,]+)/gi, /consulate.*?([A-Za-z\s,]+)/gi, /posted to ([A-Za-z\s,]+)/gi, /location[:\s]+([A-Za-z\s,]+)/gi];
//     for (const pattern of locationPatterns) {
//       const match = resultHtml.match(pattern);
//       if (match) {
//         // Extract just the location part, not the full match
//         const locMatch = match[0].split(':').pop()?.split(match[0].match(/[A-Za-z\s,]+/)?.[0] || '').pop();
//         if (locMatch && locMatch.trim()) {
//           location = locMatch.trim();
//           break;
//         }

//         // Alternative extraction
//         const extracted = match[0].replace(/(embassy|consulate|posted to|location)/gi, '').trim();
//         if (extracted) {
//           location = extracted;
//           break;
//         }
//       }
//     }

//     // If no location found in text, try common location containers
//     if (!location) {
//       const locationSelectors = ['.location', '.post', '.embassy', '#location', '.consulate', '.office', '.center'];
//       for (const selector of locationSelectors) {
//         const locationEl = result$(selector);
//         if (locationEl.length > 0) {
//           location = locationEl.first().text().trim();
//           if (location) break;
//         }
//       }
//     }

//     // If still no location, try to extract from body text with more patterns
//     if (!location) {
//       const locationMatches = resultHtml.match(/(?:at the|posted to|processed at)[\s:]*(?:U\.?S\.?\s+)?(?:Embassy|Consulate|Office)\s*,?\s*([A-Za-z\s,]+)/i);
//       if (locationMatches && locationMatches[1]) {
//         location = locationMatches[1].trim();
//       } else {
//         // Another pattern
//         const altLocationMatch = resultHtml.match(/(?:Embassy|Consulate|Office)\s+of\s+the\s+United\s+States\s+in\s+([A-Za-z\s,]+)/i);
//         if (altLocationMatch && altLocationMatch[1]) {
//           location = altLocationMatch[1].trim();
//         }
//       }
//     }

//     // Set default location if none found
//     if (!location || location.length < 2) {
//       location = 'US Embassy/Consulate';
//     }

//     // Set current date as status date
//     statusDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

//     // Create result object
//     const result: VisaStatusResult = {
//       status,
//       caseNumber,
//       applicationType,
//       location,
//       statusDate,
//       message: message || 'Status information retrieved from the system.',
//       additionalInfo
//     };

//     return result;
//   } catch (error) {
//     console.error("Error scraping CEAC status:", error);
//     // Return null to indicate failure, which will trigger the error response
//     return null;
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const { applicationType, caseNumber, passportNumber, surname } = await req.json();

//     console.log("Real CEAC visa status check request received:", { applicationType, caseNumber });

//     if (!applicationType || !caseNumber?.trim()) {
//       return NextResponse.json(
//         { error: "Application type and case number are required" },
//         { status: 400 }
//       );
//     }

//     // Validate application type
//     if (!['IV', 'NIV'].includes(applicationType)) {
//       return NextResponse.json(
//         { error: "Application type must be either 'IV' (Immigrant Visa) or 'NIV' (Nonimmigrant Visa)" },
//         { status: 400 }
//       );
//     }

//     // Attempt to check visa status with real scraping
//     const result = await scrapeCEACStatus(applicationType, caseNumber, passportNumber, surname);

//     if (!result) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Could not retrieve visa status. Please check your information and try again later. The case number may be invalid or the system may be temporarily unavailable.",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       result,
//     });
//   } catch (error) {
//     console.error("API Error in visa status check:", error);
//     return NextResponse.json(
//       {
//         error: "Internal server error",
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     );
//   }
// }