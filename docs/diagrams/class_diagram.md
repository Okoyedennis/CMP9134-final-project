classDiagram
class User {
-String username
-String passwordHash
-String role
+login() bool
+getRole() String
}
class RobotController {
-String apiEndpoint
+getStatus() JSON
+moveRobot(int x, int y) bool
}
class MissionLog {
-String command
-String user
-String timestamp
+logCommand() void
}
User "1" --> "1" RobotController : Uses
RobotController "1" --> "1" MissionLog : Logs commands
