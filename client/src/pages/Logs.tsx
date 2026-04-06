import { ChevronLeft, ChevronRight, ScrollText } from "lucide-react";
import Navbar from "../components/Navbar";
import { useRobotApi } from "../hooks/useRobotApi";
import { formatDate, formatTime } from "../common/Utils";
import { useEffect, useState } from "react";
import type { LogsResponse } from "../services/robotApi";
import SelectInput from "../common/SelectInput";
import PageHelmet from "../components/PageHelmet";

const Logs = () => {
  const [logs, setLogs] = useState<LogsResponse | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");

  const { getLogs, isLoading } = useRobotApi();

  const itemPerPageData = [
    { name: "10 rows", id: "10" },
    { name: "15 rows", id: "15" },
    { name: "20 rows", id: "20" },
    { name: "50 rows", id: "50" },
    { name: "100 rows", id: "100" },
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsData = await getLogs(page.toString(), limit.toString());
        setLogs(logsData);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, [page, limit]);

  return (
    <>
      <PageHelmet
        title="Mission Logs | Robot GCS"
        description="View mission audit logs and robot command history."
      />

      <div className=" min-h-screen bg-gcs-dark text-gray-100 app_container">
        <Navbar active="logs" />
        <main className="container mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ScrollText className="w-5 h-5 mr-2 text-blue-500" />
            Logs
          </h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
              <p className="mt-2 text-gray-300">Loading logs...</p>
            </div>
          ) : (
            <>
              {logs?.data.length === 0 ? (
                <div className="gcs-card">
                  <p className="text-gray-400 text-center">
                    No logs available.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="min-w-full text-sm text-left text-gray-300">
                      <thead className="bg-gray-800 text-gray-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold">S/N</th>
                          <th className="px-4 py-3 font-semibold">Forename</th>
                          <th className="px-4 py-3 font-semibold">Email</th>
                          <th className="px-4 py-3 font-semibold">
                            Command Type
                          </th>
                          <th className="px-4 py-3 font-semibold">Date</th>
                          <th className="px-4 py-3 font-semibold">Time</th>
                          <th className="px-4 py-3 font-semibold">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs?.data.map((log, index) => (
                          <tr
                            key={log._id}
                            className={
                              index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                            }>
                            <td className="px-4 py-3 border-t border-gray-700">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 border-t border-gray-700">
                              {log.userForename}
                            </td>
                            <td className="px-4 py-3 border-t border-gray-700">
                              {log.userEmail}
                            </td>
                            <td className="px-4 py-3 border-t border-gray-700">
                              {log.commandType}
                            </td>

                            <td className="px-4 py-3 border-t border-gray-700">
                              {formatDate(log.createdAt)}
                            </td>
                            <td className="px-4 py-3 border-t border-gray-700">
                              {formatTime(log.createdAt)}
                            </td>

                            <td className="px-4 py-3 border-t border-gray-700">
                              {log.role}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-4 w-full">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={!logs?.pagination?.hasPrevPage}
                        onClick={() => setPage((prev) => prev - 1)}
                        className="px-4 py-2 rounded bg-gray-700 disabled:opacity-50">
                        <ChevronLeft />
                      </button>

                      <span className="text-sm text-gray-300">
                        Page {logs?.pagination?.currentPage} of{" "}
                        {logs?.pagination?.totalPages}
                      </span>

                      <button
                        disabled={!logs?.pagination?.hasNextPage}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="px-4 py-2 rounded bg-gray-700 disabled:opacity-50">
                        <ChevronRight />
                      </button>
                    </div>
                    <div className="">
                      <SelectInput
                        onChange={(e) => setLimit(e.target.value)}
                        value={limit}
                        placeHolder="Select"
                        options={itemPerPageData}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default Logs;
