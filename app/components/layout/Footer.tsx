export default function Footer() {
    return (
        <footer className="bg-[#334155] text-white py-10 px-6 mt-20">
            <div className="max-w-[1400px] mx-auto">
                <div className="bg-[#f59e0b]/10 border-l-4 border-[#f59e0b] p-4 mb-6 rounded-sm">
                    <p className="text-sm leading-6">
                        <strong>⚖️ Legal Disclaimer:</strong> Rahvana is not a law firm and does not provide legal advice. All information provided is for educational purposes only and should not be construed as legal advice. Immigration laws are complex and subject to change. For legal guidance specific to your situation, please consult a licensed immigration attorney. Use of this platform does not create an attorney-client relationship.
                    </p>
                </div>

                <div className="flex flex-col justify-center items-center col mb-6">
                <p className="text-xl font-semibold">🛂 Rahvana</p>
                <p className="text-lg mt-2">Your visa journey companion</p>
            </div>

            <div className='flex justify-center items-center gap-6 mb-6'>
                <a href="#">Terms of Service</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Contact Us</a>
                <a href="#">About Rahvana</a>
            </div>

            <div className="flex justify-center items-center mt-6 text-white/60 text-sm">
                © 2025 Rahvana. All rights reserved. | Last updated: December 2025
            </div>
            </div>
        </footer>
    );
}