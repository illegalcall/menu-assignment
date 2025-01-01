import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client
const prisma = new PrismaClient()

async function main() {
  // Create root menu items
  const menu1 = await prisma.menuItem.create({
    data: {
      title: 'system management',
      position: 1,
      isMenu: true,  // This is a parent menu item
      parentId: null, // Root-level menu
    },
  })

  const menu2 = await prisma.menuItem.create({
    data: {
      title: 'About Us',
      position: 2,
      isMenu: true,  // This is a parent menu item
      parentId: null, // Root-level menu
    },
  })

  // Create submenu items under the 'Home' menu
  const submenu1 = await prisma.menuItem.create({
    data: {
      title: 'Dashboard',
      position: 1,
      isMenu: false,  // This is a submenu (leaf node)
      parentId: menu1.id, // Parent menu is 'Home'
    },
  })

  const submenu2 = await prisma.menuItem.create({
    data: {
      title: 'Settings',
      position: 2,
      isMenu: false,  // This is a submenu (leaf node)
      parentId: menu1.id, // Parent menu is 'Home'
    },
  })

  // Create submenu items under the 'About Us' menu
  const submenu3 = await prisma.menuItem.create({
    data: {
      title: 'Team',
      position: 1,
      isMenu: false,  // This is a submenu (leaf node)
      parentId: menu2.id, // Parent menu is 'About Us'
    },
  })

  const submenu4 = await prisma.menuItem.create({
    data: {
      title: 'Mission',
      position: 2,
      isMenu: false,  // This is a submenu (leaf node)
      parentId: menu2.id, // Parent menu is 'About Us'
    },
  })

  console.log({ menu1, menu2, submenu1, submenu2, submenu3, submenu4 })
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // Close Prisma Client at the end
    await prisma.$disconnect()
  })
