import Header from "../components/Header";
import { CiLogin } from "react-icons/ci";
import { BsLayers } from "react-icons/bs";
import { FiColumns, FiUsers, FiActivity, FiBarChart2 } from "react-icons/fi";
import { Card } from "../components/Card";

const cardsData = [
  {
    icon: FiColumns,
    title: "Boards & columns",
    description: "To Do, In Progress and Done out of the box, fully editable.",
  },
  {
    icon: FiUsers,
    title: "Team roles",
    description:
      "Owner, admin, member and viewer permissions enforced in the database.",
  },
  {
    icon: FiActivity,
    title: "Activity logs",
    description:
      "Every create, move and comment recorded with a full audit trail.",
  },
  {
    icon: FiBarChart2,
    title: "Analytics",
    description:
      "Completion rate, overdue work and priority breakdowns at a glance.",
  },
];

function LandingPage() {
  return (
    <>
      <Header
        brandIcon={
          <BsLayers className="text-primary rounded-md p-2  w-9 h-9" />
        }
        actions={[
          {
            label: "Sign In",
            to: "/auth",
            icon: <CiLogin className="w-4 h-4" />,
            className:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary rounded-xl text-gray-700 hover:text-gray-900 transition-colors",
          },
        ]}
      />

      <main className="pt-24 max-w-7xl mx-auto mt-12 px-6">
        <section className="text-center ">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Our Application, Kanban{" "}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Workspaces, boards, tasks, comments and analytics, all in one place.
            Streamline your workflow and boost productivity with our intuitive
            platform.
          </p>
          <a
            href="/login"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Get Started
          </a>
        </section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-20">
          {cardsData.map((item) => (
            <Card
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </main>
    </>
  );
}

export default LandingPage;
