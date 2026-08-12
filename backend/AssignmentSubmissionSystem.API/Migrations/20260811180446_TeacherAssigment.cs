using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AssignmentSubmissionSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class TeacherAssigment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AcademicClassId",
                table: "Students",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TeacherAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TeacherId = table.Column<int>(type: "integer", nullable: false),
                    AcademicClassId = table.Column<int>(type: "integer", nullable: false),
                    SubjectId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeacherAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeacherAssignments_AcademicClasses_AcademicClassId",
                        column: x => x.AcademicClassId,
                        principalTable: "AcademicClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeacherAssignments_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeacherAssignments_Teachers_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "Teachers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Students_AcademicClassId",
                table: "Students",
                column: "AcademicClassId");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherAssignments_AcademicClassId",
                table: "TeacherAssignments",
                column: "AcademicClassId");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherAssignments_SubjectId",
                table: "TeacherAssignments",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherAssignments_TeacherId_AcademicClassId_SubjectId",
                table: "TeacherAssignments",
                columns: new[] { "TeacherId", "AcademicClassId", "SubjectId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_AcademicClasses_AcademicClassId",
                table: "Students",
                column: "AcademicClassId",
                principalTable: "AcademicClasses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_AcademicClasses_AcademicClassId",
                table: "Students");

            migrationBuilder.DropTable(
                name: "TeacherAssignments");

            migrationBuilder.DropIndex(
                name: "IX_Students_AcademicClassId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "AcademicClassId",
                table: "Students");
        }
    }
}
