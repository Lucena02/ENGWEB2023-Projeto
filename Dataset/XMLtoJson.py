import json
import xml.etree.ElementTree as ET
import re
import os


IMAGENSATUAIS = os.listdir("./atual")


def figurasAtuais(idRua, nome):
    global IMAGENSATUAIS
    figuras, numFiguras = [], 0
    for imagem in IMAGENSATUAIS:
        if re.match(fr'^{idRua}-', imagem):
            numFiguras += 1
            img = {
                    "_id": f"MRB-{idRua}-atual_{numFiguras}",
                    "imagem": {
                        "path": f"../atual/{imagem}",
                        "largura": None
                        },
                    "legenda": f"{nome} - Vista Atual nº {numFiguras}"
                }
            figuras.append(img)
    return figuras


def parseFiguras(corpo):
    figuras = []
    for fig in corpo.findall("./figura"):
        figId = fig.attrib["id"]
        img = fig.find("./imagem")
        path = img.attrib["path"]
        largura = None
        if "largura" in img.attrib:
            largura = img.attrib["largura"]
        imagem = {"path": path, "largura": largura}
        legenda = re.sub(r"\s*\n\s*", "", fig.find("./legenda").text)
        figura = {"_id": figId, "imagem": imagem, "legenda": legenda}
        figuras.append(figura)

    return figuras


def parseEntidade(ent):
    t = str(ent.text) + str(ent.tail)
    entidade = {}
    tipo = "pessoa"
    if "tipo" in ent.attrib:
        tipo = ent.attrib["tipo"]
    entidade["nome"] = re.sub(r"\s*\n\s*", " ", ent.text)
    entidade["tipo"] = re.sub(r"\s*\n\s*", " ", tipo)

    return entidade, t


def parseLugar(lug):
    t = str(lug.text) + str(lug.tail)
    nome = re.sub(r"\s*\n\s*", "", lug.text)
    norm = None
    if "norm" in lug.attrib:
        norm = re.sub(r"\s*\n\s*", " ", lug.attrib["norm"])

    lugar = {"nome": nome, "norm": norm}

    return lugar, t


def parseData(dat):
    t = str(dat.text) + str(dat.tail)
    data = re.sub(r"\s*\n\s*", "", dat.text)

    return data, t


def parseRefs(nodo):
    entidades = []
    lugares = []
    datas = []
    texto = ""

    for child in nodo:
        if child.tag == "entidade":
            entidade, t = parseEntidade(child)
            entidades.append(entidade)
            texto += t
        elif child.tag == "lugar":
            lugar, t = parseLugar(child)
            lugares.append(lugar)
            texto += t
        elif child.tag == "data":
            data, t = parseData(child)
            datas.append(data)
            texto += t
        else:
            print("Tag deve ser entidade, lugar ou data")

    refs = {"entidades": entidades, "lugares": lugares, "datas": datas}
    return refs, texto


def parseParagrafos(nodo):
    texto = ""
    refs = {"entidades": [], "lugares": [], "datas": []}
    for para in nodo.findall("./para"):
        r, t = parseRefs(para)
        t = str(para.text) + t
        t = re.sub(r"\s*\n\s*", "", t)
        texto = texto + t + "\n"
        for key in r.keys():
            refs[key].extend(r[key])

    return {"refs": refs,
            "texto": texto}


def parseDesc(casa):
    desc = {"refs": {
                "entidades": [],
                "lugares": [],
                "datas": []
        },
        "texto": ""
    }
    for descNode in casa.findall("./desc"):
        par = parseParagrafos(descNode)
        desc["texto"] += par["texto"] + "\n"
        refs = par["refs"]
        for key in refs.keys():
            desc["refs"][key].extend(refs[key])
    desc["texto"] = (len(desc["texto"])>0 and desc["texto"][0:-1]) or ""
    return desc


def parseCasa(c):
    numero = c.find("./número").text
    enfiteutas = [enf.text for enf in c.findall("./enfiteuta")]
    foro = ((nodo := c.find("./foro")) and nodo.text) or None
    desc = parseDesc(c)
    vista = ((nodo := c.find("./vista")) and nodo.text) or None

    return {"numero": numero, "enfiteutas": enfiteutas,
            "foro": foro, "desc": desc, "vista": vista}


def parseCasas(listaCasas):
    casas = []
    for lista in listaCasas:
        for casa in lista.findall("./casa"):
            casas.append(parseCasa(casa))

    return casas


def parseXML(xmlFile):
    objeto = {}
    tree = ET.parse(xmlFile)

    rua = tree.getroot()

    meta = rua.find("./meta")
    objeto["numero"] = int(re.sub(r"\s*\n\s*", "", meta.find("./número").text))
    objeto["nome"] = re.sub(r"\s*\n\s*", "", meta.find("./nome").text)
    objeto["pos"] = {"latitude": 0, "longitude":  0}

    corpo = rua.find("./corpo")

    objeto["figuras"] = parseFiguras(corpo)
    objeto["figuras"].extend(figurasAtuais(objeto["numero"], objeto["nome"]))
    objeto["paragrafo"] = parseParagrafos(corpo)
    objeto["casas"] = parseCasas(corpo.findall("./lista-casas"))

    return objeto


def main():
    dataset = []

    for xmlFile in os.listdir("./texto"):
        dataset.append(parseXML(f"./texto/{xmlFile}"))

    with open("../Dataset/dataset.json", "w") as jsonFile:
        json.dump(dataset, jsonFile, ensure_ascii=False)


if __name__ == "__main__":
    main()
