"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SceneEditor } from "@/components/SceneEditor";
import { VisualScripting } from "@/components/VisualScripting";
import { AIModelGeneration } from "@/components/AIModelGeneration";
import { AssetManagement } from "@/components/AssetManagement";
import { SceneExport } from "@/components/SceneExport";
import { useState } from "react";

const navItems = [
  {
    title: "Scene Editor",
    icon: Icons.home,
    component: <SceneEditor />,
  },
  {
    title: "Visual Scripting",
    icon: Icons.workflow,
    component: <VisualScripting />,
  },
  {
    title: "AI Model Generation",
    icon: Icons.shield,
    component: <AIModelGeneration />,
  },
  {
    title: "Asset Management",
    icon: Icons.file,
    component: <AssetManagement />,
  },
  {
    title: "Scene Export",
    icon: Icons.share,
    component: <SceneExport />,
  },
];

export default function Home() {
  const [activeComponent, setActiveComponent] = useState(navItems[0].component);

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <h2 className="font-semibold text-lg">Web3DEngine</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Features</SidebarGroupLabel>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={() => setActiveComponent(item.component)}>
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-sm">
              <SidebarTrigger className="w-full mt-2">Toggle Sidebar</SidebarTrigger>
            </p>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {navItems.find((item) => item.component === activeComponent)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>{activeComponent}</CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
