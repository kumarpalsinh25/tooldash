import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";

export default function ToolsPage() {
  return (
    <Container className="py-16">
      <div className="space-y-4">
        <Typography variant="h1">Tools</Typography>
        <Typography color="muted">
          Browse and use developer tools and utilities.
        </Typography>
      </div>
    </Container>
  );
}
