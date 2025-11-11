export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm">
          <p className="mb-2">
            © {new Date().getFullYear()} HCI Research Trends. All rights reserved.
          </p>
          <p className="text-gray-400 italic max-w-4xl mx-auto">
            The UC ACM SIGCHI Student Chapter is a registered student organization with the University of Cincinnati. 
            Registration shall not be construed as the University of Cincinnati's approval, disapproval, endorsement, 
            or sponsorship of the student organization's publications, activities, statements, purposes, actions, or positions.
          </p>
        </div>
      </div>
    </footer>
  );
}
