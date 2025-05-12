import Link from 'next/link'

export default function TermsOfService() {
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
        
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>
            Last Updated: May 9, 2025
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to SmartText Connect. These Terms of Service govern your use of our website and services.
            By accessing or using our services, you agree to be bound by these Terms.
          </p>
          
          <h2>2. Definitions</h2>
          <p>
            <strong>"Service"</strong> refers to the SmartText Connect application, website, and any related services.
          </p>
          <p>
            <strong>"User"</strong> refers to individuals who register for and use our Service.
          </p>
          <p>
            <strong>"Business"</strong> refers to the business entity created and managed by a User through our Service.
          </p>
          
          <h2>3. Account Registration</h2>
          <p>
            To use certain features of the Service, you must register for an account. You agree to provide accurate,
            current, and complete information during the registration process and to update such information to keep it
            accurate, current, and complete.
          </p>
          
          <h2>4. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities
            that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
          
          <h2>5. Privacy</h2>
          <p>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal
            information. By using our Service, you agree to our collection and use of information as described in our
            Privacy Policy.
          </p>
          
          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by SmartText Connect and are
            protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          
          <h2>7. User Content</h2>
          <p>
            You retain all rights to any content you submit, post, or display on or through the Service. By submitting
            content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce,
            modify, adapt, publish, translate, and distribute your content in any existing or future media.
          </p>
          
          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or
            liability, for any reason, including if you breach these Terms.
          </p>
          
          <h2>9. Limitation of Liability</h2>
          <p>
            In no event shall SmartText Connect, its directors, employees, partners, agents, suppliers, or affiliates be
            liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits,
            data, or other intangible losses, resulting from your access to or use of or inability to access or use the
            Service.
          </p>
          
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide
            at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be
            determined at our sole discretion.
          </p>
          
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            <a href="mailto:support@smarttextconnect.com" className="text-blue-600 hover:text-blue-800">
              support@smarttextconnect.com
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
