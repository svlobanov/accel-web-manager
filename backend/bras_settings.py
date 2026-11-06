# Please do not use special name 'all' for BRAS
import platform

# Pega o nome de rede da máquina
hostname = platform.node()

bras_options = {
    f"{hostname}": ["accel-cmd", "-Hlocalhost", "-p2001"],
    #"br2": ["accel-cmd", "-H127.0.0.1", "-p2001"],
}
