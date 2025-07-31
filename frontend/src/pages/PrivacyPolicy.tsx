// PrivacyPolicy.js
const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        </div>
        <div className="p-8">
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p className="text-lg mb-6">
              We are committed to protecting your privacy. We only collect necessary user data for improving our services and never share your personal information without consent.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-2">Data Collection</h3>
              <p>We collect minimal data required to provide and improve our recommendation services.</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-2">Data Protection</h3>
              <p>Your data is encrypted and stored securely using industry-standard practices.</p>
            </div>

            <p className="text-gray-600 italic">
              For more details, please review the complete policy document available upon request.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;