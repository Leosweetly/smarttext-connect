import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-24">
      <div className="max-w-3xl w-full">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>
            Last Updated: May 9, 2025
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            At SmartText Connect, we respect your privacy and are committed to protecting your personal data.
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
          </p>
          
          <h2>2. Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our service, including:
          </p>
          <ul>
            <li>
              <strong>Personal Information:</strong> Email address, name, and other information you provide when creating an account.
            </li>
            <li>
              <strong>Business Information:</strong> Information about your business that you provide through our service.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you access and use our service.
            </li>
            <li>
              <strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access our service.
            </li>
          </ul>
          
          <h2>3. How We Collect Your Information</h2>
          <p>
            We collect information through:
          </p>
          <ul>
            <li>Direct interactions when you create an account or use our service.</li>
            <li>Automated technologies or interactions, such as cookies and similar tracking technologies.</li>
            <li>Third parties or publicly available sources, such as analytics providers.</li>
          </ul>
          
          <h2>4. How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our service.</li>
            <li>Process and complete transactions.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and requests.</li>
            <li>Communicate with you about products, services, offers, and events.</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our service.</li>
            <li>Detect, prevent, and address technical issues.</li>
            <li>Protect the safety, integrity, and security of our service, users, and the public.</li>
          </ul>
          
          <h2>5. Data Security</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
          </p>
          
          <h2>6. Data Retention</h2>
          <p>
            We will only retain your personal information for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
          
          <h2>7. Your Data Protection Rights</h2>
          <p>
            Depending on your location, you may have the following rights:
          </p>
          <ul>
            <li>The right to access, update, or delete your information.</li>
            <li>The right to rectification if your information is inaccurate or incomplete.</li>
            <li>The right to object to our processing of your personal information.</li>
            <li>The right to request restriction of processing of your personal information.</li>
            <li>The right to data portability.</li>
            <li>The right to withdraw consent at any time where we relied on your consent to process your personal information.</li>
          </ul>
          
          <h2>8. Third-Party Services</h2>
          <p>
            Our service may contain links to third-party websites and services that are not owned or controlled by SmartText Connect. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>
          
          <h2>9. Children's Privacy</h2>
          <p>
            Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
          </p>
          
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
          </p>
          
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            <a href="mailto:privacy@smarttextconnect.com" className="text-blue-600 hover:text-blue-800">
              privacy@smarttextconnect.com
            </a>
          </p>
        </div>
        
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} SmartText Connect. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  )
}
