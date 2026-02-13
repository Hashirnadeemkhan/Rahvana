"use client";
import React, { useState } from "react";
import { MapPin, Phone, Search, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the type for passport offices
type PassportOffice = {
  sno: number;
  province: string;
  city: string;
  officeName: string;
  address: string;
  contact: string;
};


// All passport offices data
const allOffices: PassportOffice[] = [
  // ISLAMABAD
  { sno: 1, province: "Islamabad", city: "Islamabad", officeName: "Headquarter DGIP", address: "G-8/1 Mauve Area, Islamabad", contact: "051-111-344-777" },
  { sno: 2, province: "Islamabad", city: "Islamabad", officeName: "Regional Passport Office", address: "13-C, Al-Hussain Plaza, G-10 Markaz, Islamabad", contact: "051-9239308" },
  { sno: 3, province: "Islamabad", city: "Islamabad", officeName: "EPO Passport Office", address: "plot 19-a ground floor, Pak Plaza, Fazal-e-haq road Blue Area, Islamabad", contact: "" },
  { sno: 4, province: "Islamabad", city: "Islamabad", officeName: "OPF (For Overseas)", address: "OPF Head Office Building, 2 Shahrah-eJamhuriat, G-5, Islamabad", contact: "" },

  // PUNJAB
  { sno: 1, province: "Punjab", city: "Lahore", officeName: "Lahore-I (Garden Town)", address: "4-A, Sher Shah Block, Behind Barkat Market Near Himayat-ul-Islam Girls College, New Garden Town", contact: "042-9201836" },
  { sno: 2, province: "Punjab", city: "Lahore", officeName: "Lahore-II (Shadman)", address: "8-A, Shahrah-e-Aewan Tijarat, Shadman, Lahore", contact: "042-9201997-9201916" },
  { sno: 3, province: "Punjab", city: "Lahore", officeName: "Lahore-III (Raiwind)", address: "14-kilometer, Main Raiwind Road, Araiyan Morr, Lahore", contact: "" },
  { sno: 4, province: "Punjab", city: "Lahore", officeName: "EPO Lahore (Defence)", address: "27-xx phase 3, DHA, Khayaban e Iqbal Road, Lahore", contact: "042-99264396" },
  { sno: 5, province: "Punjab", city: "Lahore", officeName: "Lahore (Shahdrah)", address: "Saeed Park, near Ravi Toll Plaza, Shahdara, Lahore", contact: "042-37921900" },
  { sno: 6, province: "Punjab", city: "Lahore", officeName: "Lahore (Punjab Bar Council)", address: "Lahore High Court Bar Association", contact: "" },
  { sno: 7, province: "Punjab", city: "Lahore", officeName: "Lahore Chamber of Commerce (LCCI)", address: "Passport Counter at Lahore Chamber of Commerce and Industry 11-A, Shara-e-Aiwan-e-Sanat-o-Tijarat, Lahore", contact: "042-99264396" },
  { sno: 8, province: "Punjab", city: "Rawalpindi", officeName: "Rawalpindi", address: "Opposite Station High School No.3, Gunjmandi More, Railway Workshop Road, (Near Bakery Chowk)", contact: "051-9237253" },
  { sno: 9, province: "Punjab", city: "Rawalpindi", officeName: "EPO Rawalpindi", address: "Near Rehman Abad, Murree Road, Rawalpindi", contact: "(925111) 178-6100" },
  { sno: 10, province: "Punjab", city: "Kahuta", officeName: "Kahuta", address: "near TMA Office Kallar Chowk, Opposite Sammi CNG Station, Rawalpindi Road, Kahuta", contact: "" },
  { sno: 11, province: "Punjab", city: "GujarKhan", officeName: "GujarKhan", address: "NBP Plaza, Near Railway underpass, Gujar Khan", contact: "" },
  { sno: 12, province: "Punjab", city: "Jehlum", officeName: "Jehlum", address: "Al-Madina Center, Old GT Road, near Civil Hospital, Jehlum", contact: "" },
  { sno: 13, province: "Punjab", city: "Pind Dadan Khan", officeName: "Pind Dadan Khan", address: "Mandhar Plaza, Near AC Office, Main Jhelum Road, Pind Dadan Khan", contact: "" },
  { sno: 14, province: "Punjab", city: "Attock", officeName: "Attock", address: "Hunt Hall Near Session Court Chowk, Adjacent to NADRA Office, Civil Lines, Attock City", contact: "057-9316211" },
  { sno: 15, province: "Punjab", city: "Chakwal", officeName: "Chakwal", address: "Flat # 10-11, 1st Floor Zila Council Plaza, Tehsil Chowk, Chakwal", contact: "" },
  { sno: 16, province: "Punjab", city: "Gujrat", officeName: "Gujrat", address: "near Deona Mandi, G.T. Road, Gujrat", contact: "053-3706270" },
  { sno: 17, province: "Punjab", city: "Gujrat", officeName: "EPO Gujrat", address: "Near Services Industries Morr Opposite Falak Marriage Hall, Gujrat", contact: "053-3706270" },
  { sno: 18, province: "Punjab", city: "Mandi-Bahauddin", officeName: "Mandi-Bahauddin", address: "Opposite District Complex, Phalia Road, Mandi-Bahauddin", contact: "" },
  { sno: 19, province: "Punjab", city: "Gujranwala", officeName: "Gujranwala", address: "Bukhari Road, Civil Lines, Near Railway Station, Gujranwala", contact: "" },
  { sno: 20, province: "Punjab", city: "Gujranwala", officeName: "EPO Gujranwala", address: "Executive Passport Office, Near FBR Regional Office, G.T Road, Gujranwala", contact: "" },
  { sno: 21, province: "Punjab", city: "Sialkot", officeName: "EPO Sialkot", address: "Haji Pura Rd, opposite Gulzar Book Depot, Muslim Colony Sialkot, Punjab, Pakistan", contact: "92523240140" },
  { sno: 22, province: "Punjab", city: "Sialkot", officeName: "Sialkot", address: "Zeeshan Housing Complex, Kashmir Road, Sialkot", contact: "-3540844" },
  { sno: 23, province: "Punjab", city: "Sialkot", officeName: "Kubay Chak (Sialkot)", address: "Kubay Chak, Sialkot", contact: "92524350224" },
  { sno: 24, province: "Punjab", city: "Faisalabad", officeName: "Faisalabad", address: "Jail Road, opposite Allied Hospital, adjacent to WASA. Faisalabad", contact: "041-9210129" },
  { sno: 25, province: "Punjab", city: "Jaranwala", officeName: "Jaranwala", address: "238 Nankana Sahib Rd near Sabzi Mandi, Jaranwala", contact: "92414318891" },
  { sno: 26, province: "Punjab", city: "Faisalabad", officeName: "EPO Faisalabad", address: "Fazal Plaza behind Kohinoor Plaza, 1 Jaranwala Road, Faisalabad", contact: "92419330415" },
  { sno: 27, province: "Punjab", city: "Sargodha", officeName: "Sargodha", address: "Masood Zaidi Road, Opposite LOGIX College, Sargodha", contact: "048-9230667" },
  { sno: 28, province: "Punjab", city: "Sargodha", officeName: "EPO Sargodha", address: "M.M Alam Road, near Sher Zaman Town, Toheed Plaza, Sargodha", contact: "" },
  { sno: 29, province: "Punjab", city: "Sargodha", officeName: "Bhalwal (Sargodha)", address: "Sargodha Gujrat Road, near Bismillah CNG Station, Bhalwal, Sargodha", contact: "" },
  { sno: 30, province: "Punjab", city: "Sahiwal", officeName: "Sahiwal", address: "520/C, Jail Road, Sahiwal", contact: "" },
  { sno: 31, province: "Punjab", city: "Sahiwal", officeName: "EPO Sahiwal", address: "Gulistan Road, Near Ali Masjid, Sahiwal", contact: "040-9200565" },
  { sno: 32, province: "Punjab", city: "Jhang", officeName: "Jhang", address: "Canal Road, Ghaziabad, Jhang Saddar, Jhang", contact: "" },
  { sno: 33, province: "Punjab", city: "Hafizabad", officeName: "Hafizabad", address: "Jami House, Mohulla Gari Awan, Sarkari Parao, Hafizabad", contact: "054-75228588" },
  { sno: 34, province: "Punjab", city: "Okara", officeName: "Okara", address: "Depalpur Road, Madina Block, Near Mahi Marriage Hall, Okara", contact: "" },
  { sno: 35, province: "Punjab", city: "Kasur", officeName: "Kasur", address: "H No. 58-A, Club Road, Abdul Shakoor Khan Colony, Kasur", contact: "" },
  { sno: 36, province: "Punjab", city: "Chiniot", officeName: "Chiniot", address: "House #11/1, W-Block, Satellite Town, Chiniot", contact: "" },
  { sno: 37, province: "Punjab", city: "Narowal", officeName: "Narowal", address: "Regional Passport Office, Old District Hospital, near Old Kacheri, Narowal", contact: "" },
  { sno: 38, province: "Punjab", city: "Sheikhupura", officeName: "Sheikhupura", address: "Regional Passport Office, Shami road, Sheikhupura", contact: "" },
  { sno: 39, province: "Punjab", city: "Nankana Sahib", officeName: "Nankana Sahib", address: "Main Magtanwal Road near PTCL Exchange, Nankana Sahib", contact: "" },
  { sno: 40, province: "Punjab", city: "Khushab", officeName: "Khushab", address: "near Municipal Committee, near Malik Shakir Bashir Awan MNA house Civil line, Khushab", contact: "" },
  { sno: 41, province: "Punjab", city: "Toba Tek Singh", officeName: "Toba Tek Singh", address: "near Zila Council, near Nadra Office, Toba Tek Singh", contact: "" },
  { sno: 42, province: "Punjab", city: "Multan", officeName: "Multan", address: "Near Madni Chowk, Passport Office Road, near Alfalah Market, U-Block, New Multan Colony, Multan", contact: "061-9220088" },
  { sno: 43, province: "Punjab", city: "Multan", officeName: "Multan (Jalalpur Pirwala)", address: "Shuja Abad Road, Opposite Govt. Special Education School, Multan", contact: "061-4210066" },
  { sno: 44, province: "Punjab", city: "Multan", officeName: "Multan (Qadirpur Rawan)", address: "Near National Bank of Pakistan, Main Khanewal Road, Tehsil Qadirpur Rawan, Multan", contact: "" },
  { sno: 45, province: "Punjab", city: "Multan", officeName: "EPO Multan", address: "Third Floor, Chen One Tower, Abdali Road, Multan", contact: "061-9200069" },
  { sno: 46, province: "Punjab", city: "Khanewal", officeName: "Khanewal", address: "House No. 20-A, Civil Lines Khanewal", contact: "" },
  { sno: 47, province: "Punjab", city: "Khanewal", officeName: "Jehanian (Khanewal)", address: "near Jehanian Industries, near Khanewal Road Bypass, Jahanian, Khanewal", contact: "" },
  { sno: 48, province: "Punjab", city: "Bahawalpur", officeName: "Bahawalpur", address: "Building # 9-A, Sawaar Muhammad Hussain Road, Model Town A, Bahawalpur", contact: "0621-9255362" },
  { sno: 49, province: "Punjab", city: "D.G.Khan", officeName: "D.G.Khan", address: "near D.G Khan Medical College, D.G Khan", contact: "0641-9260308" },
  { sno: 50, province: "Punjab", city: "Taunsa Shareef", officeName: "Taunsa Shareef", address: "near Post office and City Courts, Kachehri Road, Taunsa Shareef", contact: "" },
  { sno: 51, province: "Punjab", city: "RahimYarKhan", officeName: "RahimYarKhan", address: "Bank Sadiq Canal Branch, Allama Iqbal Town, near Zarai Taraqiyati Bank, Canal Road, RahimYarKhan", contact: "068-9230433" },
  { sno: 52, province: "Punjab", city: "Muzaffargarh", officeName: "Muzaffargarh", address: "Talairy By-Pass, near Alflah Bank, Multan Road, Muzaffargarh", contact: "" },
  { sno: 53, province: "Punjab", city: "Bahawalnagar", officeName: "Bahawalnagar", address: "House # 8, Bublana street, East Jail Road, Hussainabad, Bahawalnagar", contact: "" },
  { sno: 54, province: "Punjab", city: "Vehari", officeName: "Vehari", address: "House # 128, Southern Block, Sharki Colony, near Cotton Research Center, Vehari", contact: "" },
  { sno: 55, province: "Punjab", city: "Mianwali", officeName: "Mianwali", address: "near Jahaz Chowk, Jail Road, Opposite Police Line Gate, Mianwali", contact: "" },
  { sno: 56, province: "Punjab", city: "Layyah", officeName: "Layyah", address: "House No. 08, Block I, Canal View Colony, College Road, Layyah City", contact: "" },
  { sno: 57, province: "Punjab", city: "Bhakkar", officeName: "Bhakkar", address: "near Piala Chowk, near PSO Pump and Ali Hospital Road, Mandi Town, Bhakkar", contact: "" },
  { sno: 58, province: "Punjab", city: "Pakpattan", officeName: "Pakpattan", address: "Regional Passport Office, 5-S, Green Town, Pakpattan", contact: "" },
  { sno: 59, province: "Punjab", city: "Rajanpur", officeName: "Rajanpur", address: "Opposite Income Tax Office, Lari Adda, Rajanpur", contact: "" },
  { sno: 60, province: "Punjab", city: "Lodhran", officeName: "Lodhran", address: "Hawayli Arraiyan Road, Ward # 5, Tehsil & District Lodhran", contact: "" },
  { sno: 61, province: "Punjab", city: "Kot Addu", officeName: "Kot Addu", address: "near Irrigation Colony, Layyah Kot Addu Road, Kot Addu", contact: "" },

  // KPK
  { sno: 1, province: "KPK", city: "Peshawar", officeName: "Peshawar", address: "Phase-5, near North West Hospital, Hayatabad, Peshawar", contact: "091-9217616-7" },
  { sno: 2, province: "KPK", city: "Peshawar", officeName: "EPO Peshawar", address: "Nadra Mega Centre Tambowanu Mor opposite Runway, next to Rasheed Motor, Peshawar", contact: "" },
  { sno: 3, province: "KPK", city: "Kohat", officeName: "Kohat", address: "DHQ Hospital Road, Gate#2, Phase II, KDA Township, Kohat", contact: "0922-9260342" },
  { sno: 4, province: "KPK", city: "D.I.Khan", officeName: "D.I.Khan", address: "Near Agriculture Research Center, Main Bannu Road, D.I.Khan", contact: "0966-9280219" },
  { sno: 5, province: "KPK", city: "Swat (Saidu Sharif)", officeName: "Swat (Saidu Sharif)", address: "Kanju Township, Swat", contact: "0946-818205, 817698" },
  { sno: 6, province: "KPK", city: "Abbottabad", officeName: "Abbottabad", address: "House No. 878, Near PC Hotel, Mansehra Road, Abbottabad", contact: "0992-385672" },
  { sno: 7, province: "KPK", city: "Bannu", officeName: "Bannu", address: "Miranshah Road, Bannu Cantt", contact: "0928-9270112, 9270207" },
  { sno: 8, province: "KPK", city: "Mardan", officeName: "Mardan", address: "near College Chowk, Opposite DIG House, Nowshera Mardan Road, Mardan", contact: "" },
  { sno: 9, province: "KPK", city: "Timergara (Lower Dir)", officeName: "Timergara (Lower Dir)", address: "Near Shaheed Chowk, near By-pass Road, Timergarah", contact: "" },
  { sno: 10, province: "KPK", city: "Buner (Daggar)", officeName: "Buner (Daggar)", address: "Near Sultana General Hospital, Buner", contact: "" },
  { sno: 11, province: "KPK", city: "Hangu", officeName: "Hangu", address: "Building No. 554/BA, Mohallah Farooq Abad, Opposite Al-Malik CNG, Kohat Road, District Hangu", contact: "" },
  { sno: 12, province: "KPK", city: "Battagram", officeName: "Battagram", address: "Khasra No:1006, Ground Floor Adjacent to NADRA Office Election Office opposite Attock Petrol Pump, Battagram", contact: "" },
  { sno: 13, province: "KPK", city: "Haripur", officeName: "Haripur", address: "Near Excise and Taxation Office, Awan Colony, Tehsil Road, Haripur", contact: "92995612241" },
  { sno: 14, province: "KPK", city: "Batkhela (Malakand)", officeName: "Batkhela (Malakand)", address: "Near District Courts, Batkhela", contact: "" },
  { sno: 15, province: "KPK", city: "Upper Dir", officeName: "Upper Dir", address: "College Colony, Near Govt. Degree College, Upper Dir", contact: "" },
  { sno: 16, province: "KPK", city: "Tank", officeName: "Tank", address: "EllahiAbad, Near Town Hall Police Check Post, Tank D.I Khan Road, Tehsil & District Tank", contact: "" },
  { sno: 17, province: "KPK", city: "Chitral", officeName: "Chitral", address: "Galogh, Mohallah Danin, Chitral", contact: "0943-413690" },
  { sno: 18, province: "KPK", city: "Alpuri Shangila", officeName: "Alpuri Shangila", address: "Shangila College Road, Opposite UBL & District Court, Alpuri Shangila", contact: "" },
  { sno: 19, province: "KPK", city: "Swabi", officeName: "Swabi", address: "Hajji Mastan Khan Plaza, Near HBL Bank Jehangira Road, Swabi", contact: "" },
  { sno: 20, province: "KPK", city: "Charsadda", officeName: "Charsadda", address: "Tangi Road, Charssada", contact: "" },
  { sno: 21, province: "KPK", city: "Naushera", officeName: "Naushera", address: "Al-Jamil Plaza, G.T. Road, Nowshera", contact: "" },
  { sno: 22, province: "KPK", city: "Karak", officeName: "Karak", address: "Major Ihsan House, near National Bank of Pakistan, Saddam Chowk, Karak", contact: "" },
  { sno: 23, province: "KPK", city: "Mansehra", officeName: "Mansehra", address: "Opposite Income Tax Office, Lari Adda, Mansehra", contact: "" },
  { sno: 24, province: "KPK", city: "Laki Marwat", officeName: "Laki Marwat", address: "Nazim Town, Main Adda, Tehsil & District Laki Marwat", contact: "" },
  { sno: 25, province: "KPK", city: "Torghar", officeName: "Torghar", address: "Regional Passport Office, Torghar", contact: "" },
  { sno: 26, province: "KPK", city: "Dassu", officeName: "Dassu", address: "Regional Passport Office, N-35, Komila, Dassu (Kohistan)", contact: "" },

  // SINDH
  { sno: 1, province: "Sindh", city: "Karachi", officeName: "Karachi-I (South)", address: "Shahrah-e-Iraq, near Mosque, adjacent to National Bank, Saddar, Karachi", contact: "021-9203092-3" },
  { sno: 2, province: "Sindh", city: "Karachi", officeName: "Karachi-II (Central)", address: "", contact: "" },
  { sno: 3, province: "Sindh", city: "Karachi", officeName: "Karachi-III (West)", address: "", contact: "" },
  { sno: 4, province: "Sindh", city: "Karachi", officeName: "Karachi-IV (East)", address: "", contact: "" },
  { sno: 5, province: "Sindh", city: "Karachi", officeName: "Karachi-V (Awami Markaz)", address: "1st Floor, EOBI House, Ex (Awami Markaz), Sharah-e-Faisal, Karachi", contact: "021-9203091" },
  { sno: 6, province: "Sindh", city: "Karachi", officeName: "EPO Karachi", address: "behind South City Hospital, adjacent to ATC court building, near \"Karachi Beach Residency\" ground floor, commercial plot # 2/5 Clifton 3, Karachi", contact: "" },
  { sno: 7, province: "Sindh", city: "Sukkar", officeName: "Sukkar", address: "House No. C-628, Mules Road, Near Local Board, Passport Office Road, Sukkur", contact: "071-5625453" },
  { sno: 8, province: "Sindh", city: "Hyderabad", officeName: "Hyderabad", address: "Plot No. S-3, Sindh Industrial Trading Estate Area, Passport Office Road, Hyderabad", contact: "0223-883864" },
  { sno: 9, province: "Sindh", city: "Larkana", officeName: "Larkana", address: "Central Jail Road, opposite Industrial Labour Colony, SITE Area, Larkana", contact: "074-4058013-4" },
  { sno: 10, province: "Sindh", city: "Shaheed Benazir Abad", officeName: "Shaheed Benazir Abad", address: "House no. 1-A, Sachal Sarmast Colony (Housing Society) Adjacent Society Colony, Shaheed Benazir Abad", contact: "" },
  { sno: 11, province: "Sindh", city: "Khairpur", officeName: "Khairpur", address: "Regional Passport Office, National Bank Kachehri road near TCS office, Khairpur", contact: "" },
  { sno: 12, province: "Sindh", city: "Dadu", officeName: "Dadu", address: "1016/63A, Qureshi Street, near Sindh Medical Centre, Jagatabad, Dadu", contact: "" },
  { sno: 13, province: "Sindh", city: "Jacobabad", officeName: "Jacobabad", address: "House no 24 & 25, near Grid Station Sahafai Colony, near Stadium Road, Jacobabad", contact: "" },
  { sno: 14, province: "Sindh", city: "Sanghar", officeName: "Sanghar", address: "near Police line Gate #01, Mirpurkhas road, Sanghar", contact: "" },
  { sno: 15, province: "Sindh", city: "Badin", officeName: "Badin", address: "Plot No. 57 & 58, Near Medical Center, Main Hyderabad Road, Badin", contact: "" },
  { sno: 16, province: "Sindh", city: "Thatta", officeName: "Thatta", address: "near DC Office & District Accounts Office, Thatta", contact: "" },
  { sno: 17, province: "Sindh", city: "Malir", officeName: "Malir", address: "near Nehal Hospital, Kala Board Begum Khurshid Road, Malir, Karachi", contact: "" },
  { sno: 18, province: "Sindh", city: "Mirpur Khas", officeName: "Mirpur Khas", address: "House No. B-1, Railway Co-operative Society, Hyderabad Road, Mirpurkhas", contact: "" },
  { sno: 19, province: "Sindh", city: "Jamshoro", officeName: "Jamshoro", address: "Bangla No. A-202, Sindh University Employees Co-operative Housing Society, Phase-I, Jamshoroo", contact: "" },
  { sno: 20, province: "Sindh", city: "Noshero Feroze", officeName: "Noshero Feroze", address: "Regional Passport Office, Sindh Colony, MA Jinnah Road, Near DCO Complex, Noshero Feroze", contact: "" },
  { sno: 21, province: "Sindh", city: "Qambar Shahdad Kot", officeName: "Qambar Shahdad Kot", address: "Survey no 592, opposite Session Court, Main Qamber Road, Qamber Shahdadkot", contact: "" },
  { sno: 22, province: "Sindh", city: "Matiari", officeName: "Matiari", address: "Regional Passport Office, Main Bypass Road, Matiari", contact: "" },
  { sno: 23, province: "Sindh", city: "Tando Muhammad Khan", officeName: "Tando Muhammad Khan", address: "Opposite Indus Medical College, Near D.C Complex, Tando Muhammad Khan", contact: "" },
  { sno: 24, province: "Sindh", city: "Kashmore", officeName: "Kashmore", address: "Mohalla Mirzapur opposite D.O Education Office, IBA University Road, Kandh Kot, Kashmore", contact: "" },
  { sno: 25, province: "Sindh", city: "Shikar Pur", officeName: "Shikar Pur", address: "HMB TOWER 1st FLOOR, Hathidar Road, District Shikarpur", contact: "" },
  { sno: 26, province: "Sindh", city: "Tando Allahyar", officeName: "Tando Allahyar", address: "Gulshan e Mehran colony, Naser pur road, Tando Allah Yar", contact: "" },
  { sno: 27, province: "Sindh", city: "Mirpur Mathelo", officeName: "Mirpur Mathelo", address: "Regional Passport Office near Deputy Commissioner Office N-5, Mirpur Mathelo", contact: "" },
  { sno: 28, province: "Sindh", city: "Umer Kot", officeName: "Umer Kot", address: "Regional Passport Office, near Golimar ground, Umer Kot", contact: "" },
  { sno: 29, province: "Sindh", city: "Mithi Tharparkar", officeName: "Mithi Tharparkar", address: "Regional Passport Office, near Airport Office Mithi, Naukot Mithi Road, Mithi Tharparkar", contact: "" },
  { sno: 30, province: "Sindh", city: "Sajawal", officeName: "Sajawal", address: "Near Benazir Income Support Office, Boys High School Road, Sajawal", contact: "" },
  { sno: 31, province: "Sindh", city: "Navy Karsaz", officeName: "Navy Karsaz", address: "Karsaz Faisal Cantonment, Karachi", contact: "" },

  // BALOCHISTAN
  { sno: 1, province: "Balochistan", city: "Quetta", officeName: "Quetta", address: "Arbab Barkat Ali Road, Near Railway Football Ground, Quetta", contact: "081-9201762" },
  { sno: 2, province: "Balochistan", city: "Quetta", officeName: "EPO Quetta", address: "Plot No. 30, main Commercial Area, Jinnah Town, Quetta", contact: "" },
  { sno: 3, province: "Balochistan", city: "Zhob", officeName: "Zhob", address: "House # A/78, near Wapda Office, Cantonment, Zhob", contact: "0822-412696" },
  { sno: 4, province: "Balochistan", city: "Gawadar", officeName: "Gawadar", address: "TTC Colony Ward, Gawadar", contact: "" },
  { sno: 5, province: "Balochistan", city: "Kech (Turbat)", officeName: "Kech (Turbat)", address: "Makran Plaza, Infront of NADRA Office, Turbat", contact: "" },
  { sno: 6, province: "Balochistan", city: "Khuzdar", officeName: "Khuzdar", address: "Divisional Secretariate Commissioner Office, Qallat Division", contact: "" },
  { sno: 7, province: "Balochistan", city: "Dera Allah Yar (Jaffarabad)", officeName: "Dera Allah Yar (Jaffarabad)", address: "House No. 353, near Ustad Muhammad Chowk, Irrigation Colony, Quetta Road, Dera Allah Yar", contact: "" },
  { sno: 8, province: "Balochistan", city: "Qilla Saifullah", officeName: "Qilla Saifullah", address: "Near Deputy Commissioner Office, Qilla Saifullah", contact: "" },
  { sno: 9, province: "Balochistan", city: "Sibbi", officeName: "Sibbi", address: "Bangla no. 1883/B Ziarat Colony, Near Qalma Chowk, Jail Road, Sibbi", contact: "" },
  { sno: 10, province: "Balochistan", city: "Kharan", officeName: "Kharan", address: "Girls College Road, Near DC Office, Kharaan", contact: "" },
  { sno: 11, province: "Balochistan", city: "Qilla Abdullah", officeName: "Qilla Abdullah", address: "Chamman, opposite D.C Office Mall Road, Talka Chamman, Qilla Abdullah", contact: "" },
  { sno: 12, province: "Balochistan", city: "Pishin", officeName: "Pishin", address: "Babu Mohallah, Salahuddin Plaza Qazi Housing Scheme Band Road, Pishin", contact: "" },
  { sno: 13, province: "Balochistan", city: "Loralai", officeName: "Loralai", address: "Pathan Kot Road, near to Jargah Hall, Loralai", contact: "" },
  { sno: 14, province: "Balochistan", city: "Ziarat", officeName: "Ziarat", address: "Al Naseeb House behind Shalimar Hotel Baldia Road, Ziarat", contact: "" },
  { sno: 15, province: "Balochistan", city: "Noshki", officeName: "Noshki", address: "Main Market Road, Opposite PTCL Exchange Near Frontier Constabulary Office, Noshki", contact: "" },
  { sno: 16, province: "Balochistan", city: "Panjgur", officeName: "Panjgur", address: "Municipal Building, Near Quetta Bus Station & Football Stadium Panjgur", contact: "" },
  { sno: 17, province: "Balochistan", city: "Jhal Magsi", officeName: "Jhal Magsi", address: "near Election Commission Office, Gandhawa, District Jhal Magsi", contact: "" },
  { sno: 18, province: "Balochistan", city: "Nasirabad", officeName: "Nasirabad", address: "near Shahzad Umrani House, near Gola Chaok, Dera Murad Jamali, District Nasirabad", contact: "" },
  { sno: 19, province: "Balochistan", city: "Barkhan", officeName: "Barkhan", address: "near DC Complex, Kohlu Road, Barkhan", contact: "" },
  { sno: 20, province: "Balochistan", city: "Musa Khel Bazar", officeName: "Musa Khel Bazar", address: "near DC Office, Musakhel", contact: "" },
  { sno: 21, province: "Balochistan", city: "Harnai", officeName: "Harnai", address: "Mohalla Jalal Abad, near Nadra Office, Harnai", contact: "" },
  { sno: 22, province: "Balochistan", city: "Dalbandin", officeName: "Dalbandin", address: "Town Gali, Hindu Muhalla, near Iqbal Hotel, Dalbandin, Chaghi", contact: "" },
  { sno: 23, province: "Balochistan", city: "Kalat", officeName: "Kalat", address: "Shaheed Norouz Ahmadzai street, near Nadra Office, near Alizai Market, Kalat", contact: "" },
  { sno: 24, province: "Balochistan", city: "Dhadar", officeName: "Dhadar", address: "near Rind Ali Dhader Bazar, opposite District Education Office, Quetta Road, Dhadar", contact: "" },
  { sno: 25, province: "Balochistan", city: "Mastung", officeName: "Mastung", address: "Aziz Abad No. 2, Jahangir Shaheed Road, Near Alfalah Masjid, Link Quetta Road, Mastung", contact: "" },
  { sno: 26, province: "Balochistan", city: "Awaran", officeName: "Awaran", address: "near DC Office, Awaran", contact: "" },
  { sno: 27, province: "Balochistan", city: "Kohlu", officeName: "Kohlu", address: "Kohlu", contact: "" },
  { sno: 28, province: "Balochistan", city: "Lasbela", officeName: "Lasbela", address: "Shareef Colony, Uthal, Lasbela", contact: "" },
  { sno: 29, province: "Balochistan", city: "Washuk", officeName: "Washuk", address: "near DC Office, Washuk", contact: "" },
  { sno: 30, province: "Balochistan", city: "Sherani", officeName: "Sherani", address: "Sherani", contact: "" },
  { sno: 31, province: "Balochistan", city: "Dera Bugti", officeName: "Dera Bugti", address: "Near Old Jamia Masjid, Near Bugti House, Dera Bugti", contact: "" },
  { sno: 32, province: "Balochistan", city: "Sohbatpur", officeName: "Sohbatpur", address: "Regional Passport Office, DC road opposite SP Office, Sohbatpur", contact: "" },

  // GILGIT BALTISTAN
  { sno: 1, province: "Gilgit Baltistan", city: "Skardu", officeName: "Skardu", address: "Near Shell Pump, Krasmathang Olding Road, Skardu", contact: "05815-920109" },
  { sno: 2, province: "Gilgit Baltistan", city: "Gilgit", officeName: "Gilgit", address: "Muhalla Qazilbash, Near Yadgar Chowk, Khomar, Gilgit", contact: "05811-920338" },
  { sno: 3, province: "Gilgit Baltistan", city: "Chillas", officeName: "Chillas", address: "District Diamir, Khasra No. 426 Harpan, Chillas", contact: "5812920216" },
  { sno: 4, province: "Gilgit Baltistan", city: "Hunza", officeName: "Hunza", address: "Main KKH. Ganish, Hunza", contact: "5813920338" },
  { sno: 5, province: "Gilgit Baltistan", city: "Astore", officeName: "Astore", address: "Passport Office, near Polo Ground, Eidgah, Astore", contact: "5817920194" },
  { sno: 6, province: "Gilgit Baltistan", city: "Ghanche", officeName: "Ghanche", address: "Regional Passport Office near PTDC Khaplu, Ghanche", contact: "5816920320" },
  { sno: 7, province: "Gilgit Baltistan", city: "Ghizer", officeName: "Ghizer", address: "Regional Passport Office, Main Bazar Gahkuch, Ghizer", contact: "5814921634" },
  { sno: 8, province: "Gilgit Baltistan", city: "Nagar", officeName: "Nagar", address: "Jaffarabad Nagar 2, Gilgit Baltistan", contact: "" },
  { sno: 9, province: "Gilgit Baltistan", city: "Shigar", officeName: "Shigar", address: "near National Bank, Fort Road, Shigar, Gilgit Baltistan", contact: "" },

  // AZAD JAMMU & KASHMIR
  { sno: 1, province: "Azad Jammu & Kashmir", city: "Muzaffarabad", officeName: "Muzaffarabad", address: "Mir Plaza Bela Noor Shah, near Bus Stand, Abbottabad Road, Muzaffarabad", contact: "058810-62792-93" },
  { sno: 2, province: "Azad Jammu & Kashmir", city: "Mirpur", officeName: "Mirpur", address: "near Bhutto park, near PC Hotel, Mirpur", contact: "058610-42133" },
  { sno: 3, province: "Azad Jammu & Kashmir", city: "Kotli", officeName: "Kotli", address: "Near DC Office, G & A Plaza, Pindi Road, Kotli", contact: "" },
  { sno: 4, province: "Azad Jammu & Kashmir", city: "Rawalakot", officeName: "Rawalakot", address: "near Baldia Chowk Bus Stand, Link Road Hajeera By-Pass. Dist. Poonch, Rawalakot", contact: "" },
  { sno: 5, province: "Azad Jammu & Kashmir", city: "Bagh (Arja)", officeName: "Bagh (Arja)", address: "Arja, near Arja Road, District Bagh", contact: "" },
  { sno: 6, province: "Azad Jammu & Kashmir", city: "Hattian", officeName: "Hattian", address: "Near NADRA Office, Kanda Bala, Tehsil & District, Hattian Bala", contact: "" },
  { sno: 7, province: "Azad Jammu & Kashmir", city: "Neelam", officeName: "Neelam", address: "Main Bazar, Post Office Near HBL Bank, Athmuqam, Neelam", contact: "" },
  { sno: 8, province: "Azad Jammu & Kashmir", city: "Sudhnoti", officeName: "Sudhnoti", address: "District Council, Sudhnoti", contact: "" },
  { sno: 9, province: "Azad Jammu & Kashmir", city: "Bhimber", officeName: "Bhimber", address: "Regional Passport Office, Castodion building Kacheri, District Courts Road, Bhimber", contact: "" },
  { sno: 10, province: "Azad Jammu & Kashmir", city: "Haveli", officeName: "Haveli", address: "Bypass Road, forward Kahutta, near AJK Bank, Haveli", contact: "" },

  // FATA
  { sno: 1, province: "FATA", city: "Ghalanay (Mohmand Agency)", officeName: "Ghalanay (Mohmand Agency)", address: "Ghalanay (Mohmand Agency)", contact: "" },
  { sno: 2, province: "FATA", city: "Parachinar (Kurram Agency)", officeName: "Parachinar (Kurram Agency)", address: "Parachinar (Kurram Agency)", contact: "" },
  { sno: 3, province: "FATA", city: "Lower Sadda", officeName: "Lower Sadda", address: "Sadda (Kurram Agency)", contact: "" },
  { sno: 4, province: "FATA", city: "Wana", officeName: "Wana", address: "Wana (South Waziristan)", contact: "" },
  { sno: 5, province: "FATA", city: "Orakzai Agency", officeName: "Orakzai Agency", address: "Orakzai Agency", contact: "" },
  { sno: 6, province: "FATA", city: "Khar", officeName: "Khar", address: "Khar (Bajaur Agency)", contact: "" },
  { sno: 7, province: "FATA", city: "Miran shah", officeName: "Miran shah", address: "Miranshah (North Waziristan)", contact: "" },

  // WORLDWIDE
  { sno: 1, province: "Worldwide", city: "London (UK)", officeName: "London (UK)", address: "Pakistan High Commission, 34 Lowndes Square, SW1X 9JN", contact: "44-0207-6649200/11" },
  { sno: 2, province: "Worldwide", city: "Frankfurt (Germany)", officeName: "Frankfurt (Germany)", address: "Consulate General of Pakistan, Eschenbachstrasse 28/Off, Kennedyalle, 60596, Frankfurt am Main", contact: "(0049-69)-69867850-41, Fax 698678517" },
  { sno: 3, province: "Worldwide", city: "Toronto (Canada)", officeName: "Toronto (Canada)", address: "7880 Keele Street, Unit 13 Vaughan, Ontario L4K 4GL", contact: "1-905-532-42, 1-905-532-9531" },
  { sno: 4, province: "Worldwide", city: "Rome (Italy)", officeName: "Rome (Italy)", address: "Embassy of Pakistan, Via Dellah Camilluccia, 682, 00135", contact: "(39-06)-36301775 & 3294836" },
  { sno: 5, province: "Worldwide", city: "New York (USA)", officeName: "New York (USA)", address: "Embassy of Pakistan, 12 East 65th Street, NY 10065", contact: "(01)-212-879-5800 Ext 229 (fax) 517-6987" },
  { sno: 6, province: "Worldwide", city: "Los Angeles (USA)", officeName: "Los Angeles (USA)", address: "Embassy of Pakistan, LA 10850 Wilshire Blvd, Suite # 1250, CA-90024", contact: "00310-4415114-4410167" },
  { sno: 7, province: "Worldwide", city: "Oslo (Norway)", officeName: "Oslo (Norway)", address: "Embassy of Pakistan, Eckersbergs Gate 20, 0244", contact: "(47) 23136080-84" },
  { sno: 8, province: "Worldwide", city: "Dubai (UAE)", officeName: "Dubai (UAE)", address: "Consulate General of Pakistan, Bur Dubai, Khalid Bin Walid Road, P.O.Box 340", contact: "0971-4-3913600" },
  { sno: 9, province: "Worldwide", city: "Jeddah (KSA)", officeName: "Jeddah (KSA)", address: "Consulate General of Pakistan, N-17, E-7 Sector Mushirefah Ibrahim Al Tassan Street (19), Building # 58, P.O.Box 182", contact: "09962-6692371" },
  { sno: 10, province: "Worldwide", city: "Riyadh (KSA)", officeName: "Riyadh (KSA)", address: "Embassy of Pakistan, Diplomatic Quarters, P.O Box 94007, Riyadh-11693", contact: "0966-14884111" },
  { sno: 11, province: "Worldwide", city: "Abu-Dhabi (UAE)", officeName: "Abu-Dhabi (UAE)", address: "Embassy of Pakistan, Plot #2, Sector W59, Diplomatic Enclave, near Sheikh Zayed Military Hospital. PO Box 846", contact: "971-2-4447800" },
  { sno: 12, province: "Worldwide", city: "Muscat(Oman)", officeName: "Muscat(Oman)", address: "Embassy of Pakistan, Building # 1702, Plot # 1629/1/4, Road # 10, Way # 2133, Madina Sultan Qaboos PC RUWI", contact: "24603439, 24696511" },
  { sno: 13, province: "Worldwide", city: "Paris (France)", officeName: "Paris (France)", address: "Embassy of Pakistan, 18 Rue Lord Byron 75008", contact: "" },
  { sno: 14, province: "Worldwide", city: "Doha (Qatar)", officeName: "Doha (Qatar)", address: "Embassy of Pakistan, Plot #30, Diplomatic Area, West Bay, P.O.Box 334", contact: "00974-44832525" },
  { sno: 15, province: "Worldwide", city: "Kuwait", officeName: "Kuwait", address: "Embassy of Pakistan, Villa #46, Qasima/Plot #5, Block-11, Street #101, Shahre-e-Police station, JABRIYA", contact: "00965-25327649-51" },
  { sno: 16, province: "Worldwide", city: "Manama (Bahrain)", officeName: "Manama (Bahrain)", address: "Embassy of Pakistan, building # 35, Road # 1901, block # 319", contact: "00973-17244113, 00973-17255960" },
  { sno: 17, province: "Worldwide", city: "Bradford (UK)", officeName: "Bradford (UK)", address: "Consul General, 12-A North Parade, BD1 3HT", contact: "(00 44 1274) 308062, 308064, 308874" },
  { sno: 18, province: "Worldwide", city: "Canberra (Australia)", officeName: "Canberra (Australia)", address: "4, Timbarra Cresent, O' Malley Act 2602", contact: "61470342957, 61451955906" },
  { sno: 19, province: "Worldwide", city: "Kuala Lumpur (Malaysia)", officeName: "Kuala Lumpur (Malaysia)", address: "132, Jalan Ampang, 50450", contact: "" },
  { sno: 20, province: "Worldwide", city: "Sydney (Australia)", officeName: "Sydney (Australia)", address: "Level-07 32 Martin Palace", contact: "+61 2 – 92221806-7" },
  { sno: 21, province: "Worldwide", city: "Athens (Greece)", officeName: "Athens (Greece)", address: "Embassy of Pakistan, Loukianou 6 Kolonaki 106 75", contact: "0030-69040070793" },
  { sno: 22, province: "Worldwide", city: "Beijing (China)", officeName: "Beijing (China)", address: "1-Dongzhimenwai Dajie, Sanlitun, 1. 100600", contact: "" },
  { sno: 23, province: "Worldwide", city: "Copenhagen (Denmark)", officeName: "Copenhagen (Denmark)", address: "Valeurserj 17, 2900 Hellerup", contact: "4539621188" },
  { sno: 24, province: "Worldwide", city: "The Hague (Netherlands)", officeName: "The Hague (Netherlands)", address: "Amaliastraat 08, 2514 Jc Den Haag", contact: "" },
  { sno: 25, province: "Worldwide", city: "Madrid (Spain)", officeName: "Madrid (Spain)", address: "Embassy of Pakistan. Call de Pedro de Valdivia, 16", contact: "34915622294" },
  { sno: 26, province: "Worldwide", city: "Manchester (UK)", officeName: "Manchester (UK)", address: "137-Dickenson Road M14 5JB", contact: "1612251786" },
  { sno: 27, province: "Worldwide", city: "Houston (USA)", officeName: "Houston (USA)", address: "11850 Jones Road, TX 77070", contact: "12818902223" },
  { sno: 28, province: "Worldwide", city: "Seoul (Korea)", officeName: "Seoul (Korea)", address: "124-12, Itaewon Dong, Yongsan-GU", contact: "8227968252" },
  { sno: 29, province: "Worldwide", city: "Washington DC (USA)", officeName: "Washington DC (USA)", address: "3517, International Court NW, DC 20008", contact: "202 243 6500" },
  { sno: 30, province: "Worldwide", city: "Dhaka (Bangladesh)", officeName: "Dhaka (Bangladesh)", address: "NE (C), Road No. 71, Gulshan II", contact: "" },
  { sno: 31, province: "Worldwide", city: "Astana (Kazakhstan)", officeName: "Astana (Kazakhstan)", address: "15 Floor, business Centre, Peking Palace Hotel, 27 Syganak Street", contact: "+7 7172 799 374, 799 375" },
  { sno: 32, province: "Worldwide", city: "Damascus (Syria)", officeName: "Damascus (Syria)", address: "East Mezzeh, Al-Farabi Street", contact: "(96311) 600-0000" },
  { sno: 33, province: "Worldwide", city: "Barcelona (Spain)", officeName: "Barcelona (Spain)", address: "Barcelona AV Sarria 271/1 08029", contact: "34631444686" },
  { sno: 34, province: "Worldwide", city: "Tanzani", officeName: "Tanzani", address: "Plot No. 338, House No. MKC/1259, Maziende Street, Rose Garden Road, Mikocheni-B Dar Es Salam", contact: "(25579) 000-0000" },
  { sno: 35, province: "Worldwide", city: "Balgrade (Serbia)", officeName: "Balgrade (Serbia)", address: "Bulevar Kneza Aleksandra Karadjordjevica 62, 11040", contact: "+381 11 266 1676" },
  { sno: 36, province: "Worldwide", city: "Romania", officeName: "Romania", address: "22 Barbu Delarancea Sector-1 71304 Bucharest", contact: "+4021 3187873" },
  { sno: 37, province: "Worldwide", city: "Baku (Azerbaijan)", officeName: "Baku (Azerbaijan)", address: "Narimanov District 106 Attaturk Avenue near Khazar Television", contact: "(99412) 400-0000" },
  { sno: 38, province: "Worldwide", city: "Tashkent (Uzbekistan)", officeName: "Tashkent (Uzbekistan)", address: "Building No. 15, Kichik Halqa Yoli Street Sobir Rahimov District", contact: "(99891) 200-0000" },
  { sno: 39, province: "Worldwide", city: "Chicago (USA)", officeName: "Chicago (USA)", address: "333 N Michigan Ave Suit 728, IL 60601", contact: "001312 781 1831" },
  { sno: 40, province: "Worldwide", city: "Pretoria (South Africa)", officeName: "Pretoria (South Africa)", address: "", contact: "0027 0 12 362 3965/ 362 4072/73, 0027 61 7724865" },
  { sno: 41, province: "Worldwide", city: "Wellington (New Zealand)", officeName: "Wellington (New Zealand)", address: "182 on Slowrd Khandallah Wellington 6035", contact: "006444790026-27" },
  { sno: 42, province: "Worldwide", city: "Stockholm (Sweden)", officeName: "Stockholm (Sweden)", address: "65 Karlavagen Street, (First Floor) 10240 Stockholm", contact: "+46 8 203300" },
  { sno: 43, province: "Worldwide", city: "Bosnia, Herzegovina", officeName: "Bosnia, Herzegovina", address: "Emerika Bluma 17, 71000, Sarajevo", contact: "" },
  { sno: 44, province: "Worldwide", city: "Nairobi (Kenya)", officeName: "Nairobi (Kenya)", address: "St. Michael's Road, Off Church Road, Westlands", contact: "+254 4443911/2" },
  { sno: 45, province: "Worldwide", city: "Vienna (Austria)", officeName: "Vienna (Austria)", address: "Hofzeile 13, A-1190", contact: "+43 1 3687381-2" },
  { sno: 46, province: "Worldwide", city: "Kieve (Ukraine)", officeName: "Kieve (Ukraine)", address: "7, Pafilovziv Per. KYIV, 01015", contact: "+380 44 280 2577" },
  { sno: 47, province: "Worldwide", city: "Ankara (Turkey)", officeName: "Ankara (Turkey)", address: "Gazi Osman Pasa Mah. Iran Cad No.37, Cankaya", contact: "" },
  { sno: 48, province: "Worldwide", city: "Colombo (Sri Lanka)", officeName: "Colombo (Sri Lanka)", address: "Embassy of Pakistan", contact: "0094112055681-2" },
  { sno: 49, province: "Worldwide", city: "Port louis (Mauritius)", officeName: "Port louis (Mauritius)", address: "9A, Queen Mary Avenue Floreal", contact: "00230 6988501-02" },
  { sno: 50, province: "Worldwide", city: "Birmingham (UK)", officeName: "Birmingham (UK)", address: "10-A, The Wharf Bridge Street B1 2JS", contact: "" },
  { sno: 51, province: "Worldwide", city: "Hong Kong (China)", officeName: "Hong Kong (China)", address: "Room 803-04, 8th Floor Tung Wai commercial Building, 109-111, Gloucester Road, Wanchai", contact: "+852 2827 1966" },
  { sno: 52, province: "Worldwide", city: "Milan (Italy)", officeName: "Milan (Italy)", address: "Via Rosa Massara De Capitani-11 20158 Mialano (MI)", contact: "0039-02 66703271" },
  { sno: 53, province: "Worldwide", city: "Berne (Switzerland)", officeName: "Berne (Switzerland)", address: "Bernastrasse 47 3005", contact: "" },
  { sno: 54, province: "Worldwide", city: "Istanbul (Turkey)", officeName: "Istanbul (Turkey)", address: "Gullu Sokak No 20, 3 Levent", contact: "0090-212 3245827" },
  { sno: 55, province: "Worldwide", city: "Phnom Penh (Cambodia)", officeName: "Phnom Penh (Cambodia)", address: "H.No. 45, St.No. 310 Sangkat Boeung Keng Kang-I", contact: "00855 23 996890-91" },
  { sno: 56, province: "Worldwide", city: "Beirut (Lebanon)", officeName: "Beirut (Lebanon)", address: "8th Floor, Verdan Plaza No. 1, Saab Salam Street, Crossroad", contact: "00961 1790327" },
  { sno: 57, province: "Worldwide", city: "Moscow (Russia)", officeName: "Moscow (Russia)", address: "17 Sadovaya Kudrinskaya Ul, 123001", contact: "007 499 766 2320" },
  { sno: 58, province: "Worldwide", city: "Jakarta (Indonesia)", officeName: "Jakarta (Indonesia)", address: "Jalan Mega Barat, Block E.3.9, Kav, 5-8, Seltan 12950", contact: "57851829" },
  { sno: 59, province: "Worldwide", city: "Bishkek (Kyrgzstan)", officeName: "Bishkek (Kyrgzstan)", address: "37 Servoa, Bhishkek", contact: "00996-312373901" },
  { sno: 60, province: "Worldwide", city: "Kathmando (Nepal)", officeName: "Kathmando (Nepal)", address: "Kapan Marg Chakrapath, Maharahgunj", contact: "+977 1 4375602" },
];

const majorOffices: PassportOffice[] = [
  { sno: 1, province: "Islamabad", city: "Islamabad", officeName: "Headquarter DGIP", address: "G-8/1 Mauve Area, Islamabad", contact: "051-111-344-777" },
  { sno: 1, province: "Punjab", city: "Lahore", officeName: "Lahore-I (Garden Town)", address: "4-A, Sher Shah Block, New Garden Town, Lahore", contact: "042-9201836" },
  { sno: 1, province: "Sindh", city: "Karachi", officeName: "Karachi-I (South)", address: "Shahrah-e-Iraq, Saddar, Karachi", contact: "021-9203092-3" },
  { sno: 1, province: "KPK", city: "Peshawar", officeName: "Peshawar", address: "Phase-5, Hayatabad, Peshawar", contact: "091-9217616-7" },
];

const provinces = Array.from(new Set(allOffices.map(office => office.province)));

export const LocationGuideSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("All");
  const [expandedOfficeId, setExpandedOfficeId] = useState<string | null>(null);

  const filteredOffices = searchTerm || selectedProvince !== "All"
    ? allOffices.filter(office => {
        const matchesSearch = searchTerm
          ? office.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            office.officeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            office.address.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

        const matchesProvince = selectedProvince === "All" || office.province === selectedProvince;

        return matchesSearch && matchesProvince;
      })
    : majorOffices;

  const toggleOfficeDetails = (id: string) => {
    setExpandedOfficeId(expandedOfficeId === id ? null : id);
  };

  const isDefaultView = !searchTerm && selectedProvince === "All";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by city or office name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#0d7377]/20 focus:border-[#0d7377] outline-none transition-all"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#0d7377]/20 focus:border-[#0d7377] outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Provinces</option>
            {provinces.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>
      
      {isDefaultView && (
        <div className="flex items-center gap-2 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0d7377]" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Regional Offices</p>
        </div>
      )}

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
        {filteredOffices.length > 0 ? (
          filteredOffices.map((office) => {
            const officeId = `${office.province}-${office.city}-${office.officeName}`;
            const isExpanded = expandedOfficeId === officeId;

            return (
              <div 
                key={officeId} 
                className={cn(
                  "border rounded-2xl overflow-hidden transition-all duration-200",
                  isExpanded ? "border-[#0d7377] bg-[#0d7377]/5 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <button
                  onClick={() => toggleOfficeDetails(officeId)}
                  className="w-full text-left p-4 flex justify-between items-center group"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className={cn("font-bold text-sm transition-colors", isExpanded ? "text-[#0d7377]" : "text-slate-900")}>
                      {office.officeName}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">{office.city}, {office.province}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                      isExpanded ? "bg-[#0d7377] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                    )}>
                      <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                    </div>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-[#0d7377]/10 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="space-y-3 mt-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#0d7377] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Full Address</p>
                          <p className="text-xs text-slate-700 leading-relaxed">{office.address}</p>
                        </div>
                      </div>
                      {office.contact && (
                        <div className="flex items-start gap-3">
                          <Phone className="w-4 h-4 text-[#0d7377] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Contact Number</p>
                            <p className="text-xs text-slate-700">{office.contact}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">No offices found</h4>
            <p className="text-xs text-slate-400 mt-1">Try searching for a different city or province.</p>
          </div>
        )}
      </div>
    </div>
  );
};