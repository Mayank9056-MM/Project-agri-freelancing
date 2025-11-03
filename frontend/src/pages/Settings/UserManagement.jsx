import React, { useState, useContext } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  UserCheck,
  Lock,
  Unlock,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeContext } from "@/context/ThemeContext";
import { AuthContext } from "@/context/AuthContext";

const UserManagement = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Mock data - replace with actual API data
  const cashiers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@store.com",
      phone: "+1 (555) 123-4567",
      role: "Senior Cashier",
      status: "active",
      avatar: "SJ",
      joinDate: "2023-01-15",
      totalSales: 1245,
      revenue: 156780,
      lastActive: "2 mins ago",
      permissions: ["sales", "returns", "reports"],
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@store.com",
      phone: "+1 (555) 234-5678",
      role: "Cashier",
      status: "active",
      avatar: "MC",
      joinDate: "2023-03-22",
      totalSales: 892,
      revenue: 98340,
      lastActive: "15 mins ago",
      permissions: ["sales", "returns"],
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@store.com",
      phone: "+1 (555) 345-6789",
      role: "Cashier",
      status: "inactive",
      avatar: "ER",
      joinDate: "2023-05-10",
      totalSales: 567,
      revenue: 67890,
      lastActive: "2 days ago",
      permissions: ["sales"],
    },
    {
      id: 4,
      name: "David Park",
      email: "david.park@store.com",
      phone: "+1 (555) 456-7890",
      role: "Senior Cashier",
      status: "active",
      avatar: "DP",
      joinDate: "2022-11-05",
      totalSales: 1567,
      revenue: 203450,
      lastActive: "1 hour ago",
      permissions: ["sales", "returns", "reports", "inventory"],
    },
    {
      id: 5,
      name: "Jessica Williams",
      email: "jessica.williams@store.com",
      phone: "+1 (555) 567-8901",
      role: "Cashier",
      status: "active",
      avatar: "JW",
      joinDate: "2023-07-18",
      totalSales: 423,
      revenue: 54320,
      lastActive: "30 mins ago",
      permissions: ["sales", "returns"],
    },
    {
      id: 6,
      name: "Robert Taylor",
      email: "robert.taylor@store.com",
      phone: "+1 (555) 678-9012",
      role: "Cashier",
      status: "suspended",
      avatar: "RT",
      joinDate: "2023-02-28",
      totalSales: 234,
      revenue: 28900,
      lastActive: "1 week ago",
      permissions: ["sales"],
    },
  ];

  const stats = [
    {
      title: "Total Cashiers",
      value: cashiers.length.toString(),
      icon: Users,
      change: "+2 this month",
      subtext: "Active staff members",
      gradient: "from-violet-500 to-purple-600",
      iconBg: "from-violet-500/20 to-purple-600/20",
      changeColor: "text-violet-500",
    },
    {
      title: "Active Now",
      value: cashiers.filter((c) => c.status === "active").length.toString(),
      icon: Activity,
      change: "Online",
      subtext: "Currently working",
      gradient: "from-emerald-500 to-green-600",
      iconBg: "from-emerald-500/20 to-green-600/20",
      changeColor: "text-emerald-500",
    },
    {
      title: "Total Revenue",
      value: `$${(cashiers.reduce((acc, c) => acc + c.revenue, 0) / 1000).toFixed(0)}K`,
      icon: Activity,
      change: "+15.3%",
      subtext: "Combined sales",
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "from-blue-500/20 to-cyan-600/20",
      changeColor: "text-blue-500",
    },
    {
      title: "Pending Issues",
      value: cashiers.filter((c) => c.status === "suspended").length.toString(),
      icon: Shield,
      change: "Action Required",
      subtext: "Needs attention",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "from-amber-500/20 to-orange-600/20",
      changeColor: "text-amber-500",
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      active: {
        bg: isDark ? "bg-emerald-500/20" : "bg-emerald-100",
        text: isDark ? "text-emerald-400" : "text-emerald-700",
        icon: CheckCircle,
        label: "Active",
      },
      inactive: {
        bg: isDark ? "bg-gray-500/20" : "bg-gray-100",
        text: isDark ? "text-gray-400" : "text-gray-700",
        icon: Clock,
        label: "Inactive",
      },
      suspended: {
        bg: isDark ? "bg-rose-500/20" : "bg-rose-100",
        text: isDark ? "text-rose-400" : "text-rose-700",
        icon: XCircle,
        label: "Suspended",
      },
    };
    return badges[status] || badges.inactive;
  };

  const getAvatarGradient = (index) => {
    const gradients = [
      "from-violet-500 to-purple-600",
      "from-blue-500 to-cyan-600",
      "from-emerald-500 to-green-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
      "from-indigo-500 to-blue-600",
    ];
    return gradients[index % gradients.length];
  };

  const filteredCashiers = cashiers.filter((cashier) => {
    const matchesSearch =
      cashier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashier.phone.includes(searchTerm);
    const matchesFilter =
      filterStatus === "all" || cashier.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1
            className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
              isDark
                ? "from-white via-gray-200 to-gray-400"
                : "from-gray-900 via-gray-700 to-gray-600"
            } bg-clip-text text-transparent`}
          >
            User Management
          </h1>
          <p
            className={`mt-2 flex items-center gap-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Users className="h-4 w-4" />
            Manage cashiers and staff members
          </p>
        </div>
        <Button
          onClick={() => setShowAddUserModal(true)}
          className={`bg-gradient-to-r ${
            isDark
              ? "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              : "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          } shadow-lg`}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Cashier
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`border-0 overflow-hidden relative group hover:scale-105 transition-all duration-300 cursor-pointer ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl shadow-black/40"
                : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.title}
                  </p>
                  <p
                    className={`text-3xl font-bold mt-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-sm font-semibold ${stat.changeColor}`}>
                      {stat.change}
                    </span>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {stat.subtext}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.iconBg} backdrop-blur-sm group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card
        className={`border-0 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
            : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-violet-500`}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                className={
                  filterStatus === "all"
                    ? "bg-gradient-to-r from-violet-600 to-purple-600"
                    : isDark
                    ? "bg-gray-800 border-gray-700"
                    : ""
                }
              >
                All
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                onClick={() => setFilterStatus("active")}
                className={
                  filterStatus === "active"
                    ? "bg-gradient-to-r from-emerald-600 to-green-600"
                    : isDark
                    ? "bg-gray-800 border-gray-700"
                    : ""
                }
              >
                Active
              </Button>
              <Button
                variant={filterStatus === "inactive" ? "default" : "outline"}
                onClick={() => setFilterStatus("inactive")}
                className={
                  filterStatus === "inactive"
                    ? "bg-gradient-to-r from-gray-600 to-gray-700"
                    : isDark
                    ? "bg-gray-800 border-gray-700"
                    : ""
                }
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cashiers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCashiers.map((cashier, index) => {
          const statusBadge = getStatusBadge(cashier.status);
          const avatarGradient = getAvatarGradient(index);

          return (
            <Card
              key={cashier.id}
              className={`border-0 overflow-hidden transition-all hover:scale-[1.02] ${
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
                  : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
              }`}
            >
              <CardContent className="p-6">
                {/* Header with Avatar and Actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                    >
                      {cashier.avatar}
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {cashier.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {cashier.role}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}
                        >
                          <statusBadge.icon className="h-3 w-3" />
                          {statusBadge.label}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "hover:bg-gray-800 text-gray-400"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail
                      className={`h-4 w-4 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {cashier.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone
                      className={`h-4 w-4 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {cashier.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar
                      className={`h-4 w-4 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Joined {new Date(cashier.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Performance Stats */}
                <div
                  className={`grid grid-cols-3 gap-4 p-4 rounded-xl ${
                    isDark ? "bg-gray-800/50" : "bg-gray-100"
                  }`}
                >
                  <div>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Total Sales
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {cashier.totalSales}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Revenue
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      ${(cashier.revenue / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Last Active
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {cashier.lastActive}
                    </p>
                  </div>
                </div>

                {/* Permissions */}
                <div className="mt-4">
                  <p
                    className={`text-xs font-semibold mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Permissions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cashier.permissions.map((perm) => (
                      <span
                        key={perm}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          isDark
                            ? "bg-violet-500/20 text-violet-400"
                            : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className={`flex-1 ${
                      isDark
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {cashier.status === "active" ? (
                    <Button
                      variant="outline"
                      className={`flex-1 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-amber-400"
                          : "bg-white border-gray-300 hover:bg-gray-50 text-amber-600"
                      }`}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCashiers.length === 0 && (
        <Card
          className={`border-0 ${
            isDark
              ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
              : "bg-gradient-to-br from-white to-gray-50 shadow-xl"
          }`}
        >
          <CardContent className="p-12 text-center">
            <Users
              className={`h-16 w-16 mx-auto mb-4 ${
                isDark ? "text-gray-700" : "text-gray-300"
              }`}
            />
            <h3
              className={`text-xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              No cashiers found
            </h3>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;