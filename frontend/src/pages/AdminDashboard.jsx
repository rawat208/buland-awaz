import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Megaphone, LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import { api, formatApiErrorDetail } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const EMPTY_POST = { title: "", type: "news", date: "", summary: "", body: "", image_url: "", published: true };

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [content, setContent] = useState([]);
  const [subs, setSubs] = useState({ volunteers: [], contacts: [] });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_POST);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => navigate("/admin/login"))
      .finally(() => setChecking(false));
  }, [navigate]);

  const load = async () => {
    try {
      const [c, s] = await Promise.all([api.get("/admin/content"), api.get("/admin/submissions")]);
      setContent(c.data);
      setSubs(s.data);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_POST);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      type: item.type,
      date: item.date,
      summary: item.summary,
      body: item.body || "",
      image_url: item.image_url || "",
      published: item.published,
    });
    setDialogOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) await api.put(`/admin/content/${editingId}`, form);
      else await api.post("/admin/content", form);
      toast.success(editingId ? "Update saved." : "Post published.");
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/admin/content/${id}`);
      toast.success("Post deleted.");
      load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    navigate("/admin/login");
  };

  if (checking || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink/60">Loading dashboard…</p>
      </div>
    );
  }

  const stats = [
    { label: "Posts live", value: content.filter((c) => c.published).length },
    { label: "Volunteers", value: subs.volunteers.length },
    { label: "Messages", value: subs.contacts.length },
  ];

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between border-b-2 border-ink px-6 py-4 md:px-10">
        <div className="flex items-center gap-2 font-display text-lg font-semibold uppercase tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center bg-brand-red text-paper">
            <Megaphone className="h-4 w-4" />
          </span>
          Buland Awaaz <span className="text-brand-red">CMS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs uppercase tracking-[0.2em] text-ink/60 md:inline">{user.email}</span>
          <Button data-testid="admin-logout-button" variant="outline" size="sm" onClick={logout} className="gap-2 border-2 border-ink">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="px-6 py-8 md:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} data-testid={`stat-${s.label.replace(/\s+/g, "-").toLowerCase()}`} className="border-2 border-ink bg-white p-5">
              <p className="font-display text-4xl font-semibold">{s.value}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-ink/60">{s.label}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="content" className="mt-8">
          <TabsList className="border-2 border-ink bg-white">
            <TabsTrigger data-testid="tab-content" value="content">News & Events</TabsTrigger>
            <TabsTrigger data-testid="tab-submissions" value="submissions">Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold uppercase tracking-tight">Published on the site</h2>
              <Button data-testid="new-post-button" onClick={openNew} className="gap-2 border-2 border-ink bg-brand-red text-paper hover:bg-ink">
                <Plus className="h-4 w-4" /> New post
              </Button>
            </div>
            <div className="overflow-x-auto border-2 border-ink bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-ink">
                    <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Title</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Type</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Date</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Status</TableHead>
                    <TableHead className="text-right text-xs font-bold uppercase tracking-[0.2em]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {content.map((item) => (
                    <TableRow key={item.id} data-testid={`content-row-${item.id}`} className="border-b border-ink/15">
                      <TableCell className="max-w-[320px] font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge className={item.type === "event" ? "bg-brand-yellow text-ink" : "bg-brand-red text-paper"}>{item.type}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.date)}</TableCell>
                      <TableCell>{item.published ? <Badge variant="outline" className="border-ink">Live</Badge> : <Badge variant="outline" className="border-ink/40 text-ink/50">Draft</Badge>}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button data-testid={`edit-post-${item.id}`} variant="outline" size="sm" onClick={() => openEdit(item)} className="border-2 border-ink">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button data-testid={`delete-post-${item.id}`} variant="outline" size="sm" onClick={() => remove(item.id)} className="border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-paper">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {content.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-sm text-ink/50">No posts yet. Create the first one.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="mt-6 space-y-10">
            <div>
              <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-tight">Volunteer signups</h2>
              <div className="overflow-x-auto border-2 border-ink bg-white">
                <Table data-testid="volunteers-table">
                  <TableHeader>
                    <TableRow className="border-b-2 border-ink">
                      <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Name</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Email</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Phone</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Interest</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subs.volunteers.map((v) => (
                      <TableRow key={v.id} data-testid={`volunteer-row-${v.id}`} className="border-b border-ink/15">
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell>{v.email}</TableCell>
                        <TableCell>{v.phone}</TableCell>
                        <TableCell><Badge variant="outline" className="border-ink">{v.interest}</Badge></TableCell>
                        <TableCell className="max-w-[240px] text-sm text-ink/70">{v.message || "—"}</TableCell>
                      </TableRow>
                    ))}
                    {subs.volunteers.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-ink/50">No volunteer signups yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div>
              <h2 className="mb-4 font-display text-xl font-semibold uppercase tracking-tight">Contact messages</h2>
              <div className="overflow-x-auto border-2 border-ink bg-white">
                <Table data-testid="contacts-table">
                  <TableHeader>
                    <TableRow className="border-b-2 border-ink">
                      <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Name</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Email</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Phone</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-[0.2em]">Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subs.contacts.map((c) => (
                      <TableRow key={c.id} data-testid={`contact-row-${c.id}`} className="border-b border-ink/15">
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.phone || "—"}</TableCell>
                        <TableCell className="max-w-[320px] text-sm text-ink/70">{c.message}</TableCell>
                      </TableRow>
                    ))}
                    {subs.contacts.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-ink/50">No messages yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="post-dialog" className="max-w-lg border-2 border-ink bg-white">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold uppercase tracking-tight">
              {editingId ? "Edit post" : "New post"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="post-title" className="text-[10px] font-bold uppercase tracking-[0.25em]">Title</Label>
              <Input id="post-title" data-testid="post-title-input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 border-2 border-ink" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-[0.25em]">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger data-testid="post-type-select" className="mt-1 border-2 border-ink">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="post-date" className="text-[10px] font-bold uppercase tracking-[0.25em]">Date</Label>
                <Input id="post-date" data-testid="post-date-input" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 border-2 border-ink" />
              </div>
            </div>
            <div>
              <Label htmlFor="post-summary" className="text-[10px] font-bold uppercase tracking-[0.25em]">Summary</Label>
              <Textarea id="post-summary" data-testid="post-summary-input" required rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="mt-1 border-2 border-ink" />
            </div>
            <div>
              <Label htmlFor="post-image" className="text-[10px] font-bold uppercase tracking-[0.25em]">Image URL (optional)</Label>
              <Input id="post-image" data-testid="post-image-input" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="mt-1 border-2 border-ink" placeholder="https://…" />
            </div>
            <div className="flex items-center justify-between border-2 border-ink px-4 py-3">
              <Label htmlFor="post-published" className="text-[10px] font-bold uppercase tracking-[0.25em]">Published (visible on site)</Label>
              <Switch id="post-published" data-testid="post-published-switch" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            </div>
            <Button data-testid="post-save-button" type="submit" disabled={saving} className="border-2 border-ink bg-brand-red text-paper hover:bg-ink">
              {saving ? "Saving…" : editingId ? "Save changes" : "Publish post"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
