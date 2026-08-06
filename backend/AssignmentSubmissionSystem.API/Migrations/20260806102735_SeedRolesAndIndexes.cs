using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AssignmentSubmissionSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedRolesAndIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Subjects_AcademicClasses_AcademicClassId",
                table: "Subjects");

            migrationBuilder.DropIndex(
                name: "IX_Subjects_AcademicClassId",
                table: "Subjects");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "System Administrator", "Admin" },
                    { 2, "Teacher", "Teacher" },
                    { 3, "Student", "Student" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_AcademicClassId_Name",
                table: "Subjects",
                columns: new[] { "AcademicClassId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AcademicClasses_Name",
                table: "AcademicClasses",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Subjects_AcademicClasses_AcademicClassId",
                table: "Subjects",
                column: "AcademicClassId",
                principalTable: "AcademicClasses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Subjects_AcademicClasses_AcademicClassId",
                table: "Subjects");

            migrationBuilder.DropIndex(
                name: "IX_Subjects_AcademicClassId_Name",
                table: "Subjects");

            migrationBuilder.DropIndex(
                name: "IX_Roles_Name",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_AcademicClasses_Name",
                table: "AcademicClasses");

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_AcademicClassId",
                table: "Subjects",
                column: "AcademicClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_Subjects_AcademicClasses_AcademicClassId",
                table: "Subjects",
                column: "AcademicClassId",
                principalTable: "AcademicClasses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
